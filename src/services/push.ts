import { Injectable, EventEmitter } from '@angular/core';
import { DB } from './data-base';
import { OneSignal, OSNotification } from '@ionic-native/onesignal';
import { ONE_SIGNAL } from '../config/config';

export const PUSH_TAGS = {
	USER_ID : "userId",
	SPECIALIZATION :'specialization',
	CLINIC : "clinic"
}


@Injectable()
export class Push{

	private receivedObservable : any = {};
	private openedObservable : any = {};

	constructor(private push: OneSignal){
	}

	public init(){
		this.push.startInit(ONE_SIGNAL.APP_ID, ONE_SIGNAL.PROJECT_NUMBER)
		this.push.inFocusDisplaying(this.push.OSInFocusDisplayOption.None);
		// this.push.setLogLevel({logLevel: 3, visualLevel: 3});
		this.push.handleNotificationReceived().subscribe((response) => {
			let payload = response.payload;
			let key = payload.additionalData.type;
			if(key === 'All'){
				Object.keys(this.receivedObservable).forEach(key => {
					this.receivedObservable[key].emit(payload);
				})
			}else{
				let received = this.receivedObservable[key];
				if(received){
					received.emit(payload);
				}
			}
		})
		this.push.handleNotificationOpened().subscribe( (response) => {
			let payload = response.notification.payload;
			let key = payload.additionalData.type;
			if(key === 'All'){
				Object.keys(this.openedObservable).forEach(key => {
					this.openedObservable[key].emit(payload);
				})
			}else{
				let opened = this.openedObservable[key]
				if(opened){
					opened.emit(payload);
				}
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
		return this.push.postNotification({
			app_id: ONE_SIGNAL.APP_ID,
			contents : {"en": message},
			headings : {"en": title},
			isAppInFocus : null,
			shown: null,
			payload : null,
			displayType : null,
			tags: tags
		})
	}

	public subscribeToRecievedPush(key){
		if(!this.receivedObservable[key]){
			this.receivedObservable[key] = new EventEmitter<any>();
		}
		return this.receivedObservable[key];
	}

	public subscribeToOpenedPush(key){
		if(!this.openedObservable[key]){
			this.openedObservable[key] = new EventEmitter<any>();
		}
		return this.openedObservable[key];
	}
}