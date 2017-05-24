import { Component, ChangeDetectorRef } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ChatServices } from './chat.service';

@Component({
	selector: 'chat-page',
	templateUrl: 'chat.html',
	providers: [ChatServices]
})
export class ChatPage{

	private messages : any;
	private msg: string;

	constructor(private service : ChatServices,
		private platform : Platform,
		private detector: ChangeDetectorRef){
		if(this.platform.is('cordova')){
			service.getInbox().subscribe(response => {
				this.messages = [];
				for (var i = 0; i < response.rows.length; i++) {
				   this.messages.push(response.rows.item(i));
				}
				this.detector.detectChanges();
			})
		}
	}


	private send(){
		let msg = this.msg;
		this.msg = "";
		this.service.sendMessage(msg).then(response => {
			console.log(response);
		})
	}
}