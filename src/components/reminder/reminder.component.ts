import { Component } from '@angular/core';
import { Storage } from '../../services'

@Component({
	selector: 'reminder',
	templateUrl: 'reminder.html'
})
export class ReminderComponent{
	notificationList:any[];
	constructor(private storage: Storage){
		this.notificationList = [{
			time: new Date(),
			body: "Please remind patient 1 to schedule a consultation tommorow"
		}, {
			time: new Date(),
			body: "It is time again to visit patient 2"
		}]
	}	
}