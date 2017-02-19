import { Component} from '@angular/core';
import { PopoverController} from 'ionic-angular';
import { MoreMenuPopover } from './more.popover';
import { queue } from './schedule.mock';
import { PatientProfilePage } from '../patient-profile/patient-profile.page';
import { RootNavController } from '../../services/services';
@Component({
	selector: 'schedule-page',
	templateUrl: 'schedule.html'
})
export class SchedulePage {
	public queue: any[];

	constructor(private popover: PopoverController,
		private rootNav: RootNavController){
		this.queue = queue;
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