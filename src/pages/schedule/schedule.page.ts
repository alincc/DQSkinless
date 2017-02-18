import { Component } from '@angular/core';
import { PopoverController } from 'ionic-angular';
import { MoreMenuPopover } from './more.popover';
@Component({
	selector: 'schedule-page',
	templateUrl: 'schedule.html'
})
export class SchedulePage{
	constructor(private popup: PopoverController){}


	showMore(event){
		let popover = this.popup.create(MoreMenuPopover);
	    popover.present({
	      ev: event
	    });
	    popover.onDidDismiss(response => {
	    	console.log(response);
	    })
	}
}