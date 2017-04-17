import { Component, ViewChild,ChangeDetectorRef} from '@angular/core';
import { PopoverController, Content} from 'ionic-angular';
import { MoreMenuPopover } from './more.popover';
import { queue } from './schedule.mock';
import { PatientProfilePage } from '../patient-profile/patient-profile.page';
import { RootNavController } from '../../services/services';
import { ScheduleService } from './schedule.service';
import { QUEUE_MAP } from '../../constants/constants'
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
	private ws : any;
	private servingNow: any;
	private queueTopOffset: number;
	public controlCss: boolean;
	private isReOrder: boolean;
	private queueBoard: any;
	constructor(private popover: PopoverController,
		private rootNav: RootNavController,
		private detector: ChangeDetectorRef,
		private service : ScheduleService){
		rootNav.reloadPublisher.subscribe(clinicId => {
			this.initSchedule(clinicId);
		})
	}

	initSchedule(clinicId){
		this.queue = queue;
		this.controlCss = false;
		this.isReOrder = false;
		if(this.ws){
			this.ws.close();
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

		this.ws.connection.subscribe(response => {
			this.service.getCurrentQueueBoard(clinicId,currentDate).subscribe(response => {
				if(response.status){
					if(!response.result.id){
						var queueBoard: any = {
							clinicId : clinicId,
							date : currentDate
						};
						this.service.createQueueBoard(queueBoard).subscribe(response => {
							if(response.status){
								queueBoard.id = response.result;
								this.queueBoard = queueBoard;
							}
						});
					}else{
						this.queueBoard = response.result;
					}
				}
			});
		}, err => {
			console.error(err);
		}, () => {
			console.log("closed");
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
		let element = this.queue[indexes.from];
	    this.queue.splice(indexes.from, 1);
	    this.queue.splice(indexes.to, 0, element);
	    this.ws.send("F");
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
				}
		});
	}

	view(patientId){
		this.rootNav.push(PatientProfilePage);
	}

	toggleReOrder(){
		this.isReOrder = !this.isReOrder;
	}

	done(){
		this.ws.send(QUEUE_MAP.DONE);
	}

	next(){
		this.ws.send(QUEUE_MAP.NEXT);
	}

	queueAgain(){
		this.ws.send(QUEUE_MAP.FETCH);
	}

	noShow(){
		this.ws.send(QUEUE_MAP.DONE);
	}



}