import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Platform, Content } from 'ionic-angular';
import { ChatServices } from './chat.service';

@Component({
	selector: 'chat-page',
	templateUrl: 'chat.html',
	providers: [ChatServices]
})
export class ChatPage{

	private messages : any;
	private msg: string;
	@ViewChild(Content)
	private content: Content;

	constructor(private service : ChatServices,
		private platform : Platform,
		private detector: ChangeDetectorRef){
		if(this.platform.is('cordova')){
			service.getInbox().subscribe(response => {
				let dimensions = this.content.getContentDimensions()
				let snapToBottom: boolean;
				if(dimensions.scrollTop === dimensions.scrollHeight){
					snapToBottom = true;
				}
				this.messages = [];
				for (var i = 0; i < response.rows.length; i++) {
					let item = response.rows.item(i);
				    this.messages.unshift(item);
				}
				if(snapToBottom){
					this.content.scrollToBottom();
				}
				this.detector.detectChanges();
			})
		}
	}


	private send(){
		let msg = this.msg;
		this.service.sendMessage(msg).then(response => {
			this.msg = "";
			console.log(response);
		}, err => {
			console.log(err);
		})
	}
}