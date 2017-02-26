import { Component, ViewChild,ChangeDetectorRef} from '@angular/core';
import { PopoverController, Content} from 'ionic-angular';
import { MoreMenuPopover } from './more.popover';
import { queue } from './schedule.mock';
import { PatientProfilePage } from '../patient-profile/patient-profile.page';
import { RootNavController } from '../../services';
@Component({
	selector: 'schedule-page',
	templateUrl: 'schedule.html'
})
export class SchedulePage {
	public queue: any[];
	@ViewChild(Content)
	private content: Content;
	@ViewChild('ServingNow')
	private set _servingNow(dom){
		this.servingNow = dom.nativeElement;
	}
	private servingNow: any;
	private queueTopOffset: number;
	public controlCss: boolean;
	constructor(private popover: PopoverController,
		private rootNav: RootNavController,
		private detector: ChangeDetectorRef){
		this.queue = queue;
		this.controlCss = false;
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
		})
	}


	reorderItems(indexes){
		let element = this.queue[indexes.from];
	    this.queue.splice(indexes.from, 1);
	    this.queue.splice(indexes.to, 0, element);
	}

	showMore(event){
		let popover = this.popover.create(MoreMenuPopover);
		popover.present({
			ev: event 
		});
		popover.onDidDismiss(response=>{
			console.log(response);
		});
	}

	view(patientId){
		this.rootNav.push(PatientProfilePage);
	}
}