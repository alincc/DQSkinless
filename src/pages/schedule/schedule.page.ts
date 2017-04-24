import { Component, ViewChild,ChangeDetectorRef} from '@angular/core';
import { PopoverController, Content, ModalController, LoadingController} from 'ionic-angular';
import { MoreMenuPopover } from './more.popover';
import { PatientProfilePage } from '../patient-profile/patient-profile.page';
import { RootNavController } from '../../services/services';
import { ScheduleService } from './schedule.service';
import { QUEUE } from '../../constants/constants'
import { AddQueueFormModal } from '../../components/add-queue-form-modal/add-queue-form.modal'
import { XHRButton } from '../../components/xhr-button/xhr-button.component';
@Component({
	selector: 'schedule-page',
	templateUrl: 'schedule.html',
	providers:[ ScheduleService ]
})
export class SchedulePage {
	public queue: any[];
	@ViewChild(Content)
	private content: Content;
	@ViewChild('ServingNow')
	private set _servingNow(dom){
		this.servingNow = dom.nativeElement;
	}
	@ViewChild('remove')
	private remove : XHRButton;
	private ws : any;
	private servingNow: any;
	private queueTopOffset: number;
	public controlCss: boolean;
	private isReOrder: boolean;
	private queueBoard: any;
	private serving: any;
	private connection: any;
	private requestForRefresh: any;
	constructor(private popover: PopoverController,
		private rootNav: RootNavController,
		private detector: ChangeDetectorRef,
		private service : ScheduleService,
		private modal: ModalController,
		private loadingCtrl: LoadingController){
		rootNav.reloadPublisher.subscribe(clinicId => {
			this.initSchedule(clinicId);
		})
	}

	initSchedule(clinicId){
		this.controlCss = false;
		this.isReOrder = false;
		if(this.ws){
			this.ws.close();
		}
		if(this.connection){
			this.connection.unsubscribe();
		}
		this.ws = this.service.connectToQueue()
		this.ws.then(
			response => {
				this.ws.send(clinicId);
			}
		);

		var currentDate = new Date();
		currentDate.setHours(0);
		currentDate.setMinutes(0);
		currentDate.setSeconds(0);
		currentDate.setMilliseconds(0);

		this.service.getQueueBoardByIdAndClinic(clinicId,currentDate).subscribe(response => {
			if(response.status){
				this.queueBoard = response.result;
				this.connection = this.ws.connection.subscribe(response => {
					if(this.requestForRefresh){
						clearTimeout(this.requestForRefresh);
					}
					this.requestForRefresh = setTimeout(()=> {
						this.fetchQueue();
						this.requestForRefresh = null;
					}, 3000);
				}, err => {
					console.error(err);
				}, () => {
					console.log("closed");
				})
			}
		});
	}


	fetchQueue(callback?, errorHandler?){
		this.service.getQueueByBoardID(this.queueBoard.id).subscribe(response => {
			if(response.status){
				let newQueueList = [];
				this.serving = null;
				for(let item of response.result){
					switch(item.status){
						case "S":
							this.serving = item;
							break;
						case "Q":
						case "E":
							newQueueList.push(item);
							break;
					}
				}
				this.queue = newQueueList;
				if(callback){
					callback(response);
				}	
			}
		}, err=> {
			if(errorHandler){
				errorHandler(err);
			}
		})
	}

	ngAfterViewInit(){
		this.queueTopOffset = this.servingNow.clientHeight;
		this.content.ionScroll.subscribe(event => {
			if(event.scrollTop > this.queueTopOffset){
				if(!this.controlCss){
					this.controlCss = true;
					this.detector.detectChanges();
				}
			}else{
				if(this.controlCss){
					this.controlCss = false;
					this.detector.detectChanges();
				}
			}
		});
		
	}


	reorderItems(indexes){
		let element = this.queue.splice(indexes.from, 1)[0];

	    // recompute order of element
	    if(indexes.to === 0){
	    	element.order = this.queue[indexes.to].order / 2;
	    }else if(indexes.to === this.queue.length){
	    	element.order = this.queue[indexes.to - 1].order + 1000;
	    }else{
	    	let orderTop = this.queue[indexes.to - 1].order;
	    	let orderBottom = this.queue[indexes.to].order;
	    	element.order = (orderTop + orderBottom) / 2;
	    }

	    this.queue.splice(indexes.to, 0, element);
	    this.updateQueue(null, element, response => {
			this.ws.send(QUEUE.MAP.FETCH);
	    });
	}

	showMore(event){
		let popover = this.popover.create(MoreMenuPopover);
		popover.present({
			ev: event 
		});
		popover.onDidDismiss(response=>{
			console.log(response);
				switch (response) {
					case 2:
						this.toggleReOrder();
						break;
					case 1:
						this.remove.click();
						break;
				}
		});
	}

	view(patientId){
		this.rootNav.push(PatientProfilePage);
	}

	toggleReOrder(){
		this.isReOrder = !this.isReOrder;
	}

	updateServing(xhr, callback?, errCallback?){
		return this.updateQueue(xhr, this.serving, callback, errCallback);
	}

	updateQueue(xhr, element, callback? , errCallback?){
		this.service.updateQueue(element).subscribe(
			response => {
				this.fetchQueue(
					response => {
						if(xhr){
							xhr.dismissLoading();
						}
						if(callback){
							callback();
						}
					}, err => {
					if(xhr){
						xhr.dismissLoading();
					}
					if(errCallback){
						errCallback();
					}
				})
			}, err => {
				if(xhr){
					xhr.dismissLoading();
				}
				if(errCallback){
					errCallback();
				}
			})
	}

	done(xhr){
		this.serving.status = QUEUE.STATUS.DONE;
		this.updateServing(xhr, () => {
			this.ws.send(QUEUE.MAP.DONE);
		});
	}

	next(xhr){
		this.serving = this.queue.splice(0,1)[0];
		this.serving.status = QUEUE.STATUS.SERVING
		this.updateServing(xhr, () => {
			this.ws.send(QUEUE.MAP.NEXT);
		});
	}

	queueAgain(){
		this.ws.send(QUEUE.MAP.FETCH);
	}

	noShow(xhr){
		this.serving.status = QUEUE.STATUS.NO_SHOW;
		this.updateServing(xhr, () => {
			this.ws.send(QUEUE.MAP.DONE);
		});
	}

	addQueue(){
		let modal = this.modal.create(AddQueueFormModal);
		modal.onDidDismiss(item => {
			if(!item){
				return;
			}
			var parameter: any = item; 
			parameter.type = QUEUE.TYPE.WALKIN;
			parameter.boardId = this.queueBoard.id;
			parameter.order = this.getNewOrder();
			parameter.time = new Date();
			parameter.status = QUEUE.STATUS.QUEUED; 

			var loading = this.loadingCtrl.create({
				spinner: 'crescent',
				cssClass: 'xhr-loading'
			});
			loading.present();
			this.service.addQueue(parameter).subscribe(
				response => {
					if(response.status){
						this.ws.send(QUEUE.MAP.FETCH);
						this.fetchQueue(response => {
							loading.dismiss();
						}, err => {
							loading.dismiss();
						})
					}else{
						loading.dismiss();
					}
				}, err => {
					loading.dismiss();
				});
		});
		modal.present();
	}

	private getNewOrder(){
		return this.queue[this.queue.length-1].order + 1000;
	}

}


