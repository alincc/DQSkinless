import { Component, ViewChild,ChangeDetectorRef} from '@angular/core';
import { PopoverController, Content, ModalController, LoadingController, AlertController} from 'ionic-angular';
import { MoreMenuPopover } from './more.popover';
import { PatientProfilePage } from '../patient-profile/patient-profile.page';
import { RootNavController } from '../../services/services';
import { ScheduleService } from './schedule.service';
import { QUEUE } from '../../constants/constants'
import { AddQueueFormModal } from '../../components/add-queue-form-modal/add-queue-form.modal'
import { XHRButton } from '../../components/xhr-button/xhr-button.component';
import { trigger,
  state,
  style,
  animate,
  transition } from '@angular/animations';
@Component({
	selector: 'schedule-page',
	templateUrl: 'schedule.html',
	providers:[ ScheduleService ],
	animations: [
	  trigger('queue', [
	    state('*', style({transform: 'translateX(0)'})),
	    transition('void => *', [
	      style({transform: 'translateX(-100%)'}),
	      animate(300)
	    ]),
	    transition('* => void', [
	      animate(300, style({transform: 'translateX(100%)'}))
	    ])
	  ]),
	  trigger('serve', [
	   state('*', style({transform: 'translateX(0)'})),
	    transition('void => *', [
	      style({transform: 'translateX(-100%)'}),
	      animate(300)
	    ]),
	    transition('* => void', [
	      animate(300, style({transform: 'translateX(100%)'}))
	    ])
	  ])
	]
})
export class SchedulePage {
	public queue: any[];
	@ViewChild(Content)
	private content: Content;
	@ViewChild('ServingNow')
	private set _servingNow(dom){
		this.servingNow = dom.nativeElement;
	}
	@ViewChild('removeBtn')
	private removeBtn : XHRButton;
	@ViewChild('queueAgainBtn')
	private queueAgainBtn : XHRButton;
	private ws : any;
	private servingNow: any;
	private queueTopOffset: number;
	public controlCss: boolean;
	private isReOrder: boolean;
	private queueBoard: any;
	private serving: any;
	private connection: any;
	private requestForRefresh: any;
	private clinicId: any;
	private servingState: string;
	constructor(private popover: PopoverController,
		private rootNav: RootNavController,
		private detector: ChangeDetectorRef,
		private service : ScheduleService,
		private modal: ModalController,
		private loadingCtrl: LoadingController,
		private alert: AlertController){
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
		this.clinicId = clinicId;

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
						case QUEUE.STATUS.SERVING:
							this.serving = item;
							break;
						case QUEUE.STATUS.QUEUED:
						case QUEUE.STATUS.EN_ROUTE:
						case QUEUE.STATUS.OUT:
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
		let popover = this.popover.create(MoreMenuPopover, {
			disableButtons : !this.serving
		});
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
						this.removeBtn.click();
						break;
					case 0:
						this.queueAgainBtn.click();
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
		this.updateQueueObservable(element).subscribe(
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

	updateQueueObservable(element){
		return this.service.updateQueue(element);
	}

	done(xhr){
		this.serving.status = QUEUE.STATUS.DONE;
		this.servingState = 'done';
		this.updateServing(xhr, () => {
			this.ws.send(QUEUE.MAP.DONE);
		});
	}

	next(xhr){
		this.preHookServingDone().then(response => {
			for(var i = 0; i < this.queue.length; i++){
				if(this.queue[i].status === QUEUE.STATUS.QUEUED){
					this.serving = this.queue.splice(i,1)[0];
					this.serving.status = QUEUE.STATUS.SERVING
					this.updateServing(xhr, () => {
						this.ws.send(QUEUE.MAP.NEXT);
					});
					return;
				}
			}
		});
	}

	hasForQueue(){
		if(this.queue){
			return Boolean(this.queue.find(item => {
				return item.status === QUEUE.STATUS.QUEUED;
			}))
		}else{
			return false;
		}
	}

	queueAgain(xhr){
		this.serving.status = QUEUE.STATUS.EN_ROUTE;
		this.servingState = 'reque';
		this.updateServing(xhr, () => {
			this.ws.send(QUEUE.MAP.DONE);
		});
	}

	noShow(xhr){
		this.serving.status = QUEUE.STATUS.NO_SHOW;
		this.servingState = 'done';
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
			var loading = this.loadingCtrl.create({
				spinner: 'crescent',
				cssClass: 'xhr-loading'
			});
			loading.present();

			var parameter: any = item;
			let parameterFactory = new Promise( (resolve, reject) =>{
				if(item.isServeNow){
					parameter.type = QUEUE.TYPE.WALKIN;
					parameter.boardId = this.queueBoard.id;
					parameter.order = this.getNewOrder();
					parameter.time = new Date();
					parameter.status = QUEUE.STATUS.QUEUED;
					resolve(parameter);
				}else{
					this.service.getQueueBoardByIdAndClinic(this.clinicId, new Date(item.schedule))
						.subscribe( response => {
							if(response.status){
								parameter.type = QUEUE.TYPE.SCHEDULED;
								parameter.boardId = response.result.id;
								parameter.order = 0,
								parameter.time = this.parseTimeSlot(item.timeSlot);
								parameter.status = QUEUE.STATUS.EN_ROUTE;
								resolve(parameter);
							}else{
								reject(parameter);
							}
						}, err => {
							reject(err);
						})
				}
			})
			parameterFactory.then( parameter => {
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
		});
		modal.present();
	}

	public getDefaultAvatar(member){
		if(member){
			return member.lastName.substring(0,1).toUpperCase() + member.firstName.substring(0,1).toUpperCase();
		}else{
			return "?";
		}
	}

	private getNewOrder(){
		return  1000 + (this.queue.length ? this.queue[this.queue.length-1].order : 0);
	}

	private parseTimeSlot(timeSlot){
		if(timeSlot && (/[0-9]{0,2}\:[0-9]{0,2}/).test(timeSlot)){
			let token = timeSlot.split(":");
			let time = new Date();
			time.setHours(token[0]);
			time.setMinutes(token[1]);
			time.setSeconds(0);
			time.setMilliseconds(0);
			return time;
		}else{
			return;
		}
	}

	private getTypeIcon(customer){
		return customer.type==='W'?'walk':'time';
	}

	private getStatusIcon(customer){
		switch(customer.status){
			case QUEUE.STATUS.EN_ROUTE:
					return 'car';
			case QUEUE.STATUS.QUEUED:
					return 'flag';
			case QUEUE.STATUS.OUT:
					return 'cafe';
		}
	}

	private serveNow(xhr,customer){
		this.preHookServingDone().then(response => {
			this.serving = customer;
			this.serving.status = QUEUE.STATUS.SERVING
			this.updateServing(xhr, () => {
				this.ws.send(QUEUE.MAP.NEXT);
			});
			return;
		});
	}

	private preHookServingDone(){
	 	return new Promise((resolve, error) => {
	 		if(this.serving){
	 			this.alert.create({
	 				message : 'You are currently serving ' + this.serving.lastName + ", " + this.serving.firstName + " " + this.serving.middleName + ", are you sure you want to get the next queue and tag current as done?",
	 				buttons: [
				      {
				        text: 'No',
				        role: 'cancel'
				      },
				      {
				        text: 'Yes',
				        handler: () => {
					        this.serving.status = QUEUE.STATUS.DONE;
					 		this.updateQueueObservable(this.serving).subscribe( response => {
						 		resolve(response);
					 		}, err => {
						 		error(err);
						 	});
				        }
				      }
				    ]
	 			}).present();
		 	}else{
		 		resolve()
		 	}
	 	});
	}

	private delete(xhr,customer){
		customer.status = QUEUE.STATUS.TRASH;
		this.updateQueue(xhr, customer, () => {
			this.ws.send(QUEUE.MAP.DONE);
		});
	}

	private arrived(xhr, customer){
		customer.status = QUEUE.STATUS.QUEUED;
		this.updateQueue(xhr, customer, () => {
			this.ws.send(QUEUE.MAP.DONE);
		});
	}

	private out(xhr, customer){
		customer.status = QUEUE.STATUS.OUT;
		this.updateQueue(xhr, customer, () => {
			this.ws.send(QUEUE.MAP.DONE);
		});
	}

	private getButtons(customer){
		let isHere = customer.status === QUEUE.STATUS.QUEUED;
		return [
			{
				name: isHere?'Going Out':'Arrived',
				icon: isHere? 'cafe': 'flag'  ,
				clickFn: (xhr,customer) => {
					if(isHere){
						return this.out(xhr, customer);
					}else{
						return this.arrived(xhr, customer);
					}
				}
			}
		]
	}

	private TrackByPatientId(index: number, item:any){
		return item.id;
	}

}