import { Injectable, EventEmitter } from '@angular/core';
import { Storage } from '.';
import { OneSignal, OSNotification } from '@ionic-native/onesignal';
import { ONE_SIGNAL } from '../config/config';
import { Headers, Http, RequestOptions } from '@angular/http';

export const PUSH_TAGS = {
	USER_ID : "userId",
	SPECIALIZATION :'specialization',
	CLINIC : "clinic",
	NAME : "firstname"
}


@Injectable()
export class Push{

	private receivedObservable : any = {};
	private openedObservable : any = {};

	constructor(private storage : Storage,
		private push: OneSignal,
		private http: Http){
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

		//subscribe tags
		this.storage.userDetailsSubject.subscribe( details => {
			let tags = {};
			tags[PUSH_TAGS.NAME] = details[PUSH_TAGS.NAME];
			tags[PUSH_TAGS.USER_ID] = details[PUSH_TAGS.USER_ID];
			tags[PUSH_TAGS.SPECIALIZATION] = details[PUSH_TAGS.SPECIALIZATION];
			this.push.sendTags(tags)
		});
		//subscribe tags
		this.storage.clinicSubject.subscribe( clinic => {
			this.push.sendTag(PUSH_TAGS.CLINIC, clinic.clinicId);
		})
	}


	public removeAllTags(){
		this.push.deleteTags(Object.keys(PUSH_TAGS).map(keys => {
			return PUSH_TAGS[keys];
		}));
	}


	public sendMessage(title, message, tags, timestamp){
		let headers = new Headers({ 'Content-Type': 'application/json' });
		headers.append('Authorization', 'Basic ' + ONE_SIGNAL.REST_KEY);
		let options = new RequestOptions({ headers: headers }); 
		return this.http.post(ONE_SIGNAL.API.CREATE, {
			filters : tags,
			contents : {"en": message},
			headings : {"en": title},
			app_id: ONE_SIGNAL.APP_ID,
			data: {
				type : ONE_SIGNAL.PUSH_TYPE.MESSAGES,
				clinic : this.storage.clinic.clinicId,
				timestamp : timestamp,
				id : new Date().getTime(),
				userId : this.storage.account.userId
			}
		}, options)
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