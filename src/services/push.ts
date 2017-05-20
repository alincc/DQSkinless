import { Injectable, EventEmitter } from '@angular/core';
import { DB } from './data-base';
import { OneSignal, OSNotification } from '@ionic-native/onesignal';
import { ONE_SIGNAL } from '../config/config';

export const PUSH_TAGS = {
	USERNAME : "username",
	SPECIALIZATION :'specialization',
	CLINIC : "clinic"
}

export const PUSH_TYPE = {
	MESSAGES : 0
}

@Injectable()
export class Push{

	public receivedObservable: any = new EventEmitter<any>();
	public openedObservable: any = new EventEmitter<any>();

	constructor(private push: OneSignal,
		private inbox: DB){
	}

	public init(){
		this.push.startInit(ONE_SIGNAL.APP_ID, ONE_SIGNAL.PROJECT_NUMBER)
		this.push.inFocusDisplaying(this.push.OSInFocusDisplayOption.None);
		// this.push.setLogLevel({logLevel: 3, visualLevel: 3});
		this.push.handleNotificationReceived().subscribe((response) => {
			let payload = response.payload;
			switch(payload.additionalData.type){
				case PUSH_TYPE.MESSAGES : 
					this.inbox.storeMessage({
						id : new Date().getTime(),
						name : payload.title,
						message : payload.body,
						clinicId : payload.additionalData.clinic
					});
					break;
				default: 
					this.receivedObservable.emit(response);
			}
		})
		
		this.push.handleNotificationOpened().subscribe( (response) => {
			let payload = response.notification.payload;
			switch(payload.additionalData.type){
				default: 
					this.openedObservable.emit(response)
			}
		})
		this.push.endInit();
	}


	public removeAllTags(){
		this.push.deleteTags(Object.keys(PUSH_TAGS).map(keys => {
			return PUSH_TAGS[keys];
		}));
	}


	public sendMessage(title, message, tags){

		this.push.postNotification({
			app_id: ONE_SIGNAL.APP_ID,
			contents : {"en": message},
			headings : {"en": title},
			isAppInFocus : null,
			shown: null,
			payload : null,
			displayType : null
		})
	}
}