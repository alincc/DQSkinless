import { Component } from '@angular/core';

@Component({
	selector: 'notification-page',
	templateUrl: 'notification.html'
})
export class NotificationPage{

	notificationList:any[];
	constructor(){
		this.notificationList = [{
			title:"Remainder",
			body: "Please remind patient 1 to schedule a consultation tommorow"
		}, {
			title:"Remainder",
			body: "It is time again to visit patient 2"
		}]
	}

	remove(idx){
		this.notificationList.splice(idx, 1);
	}
}