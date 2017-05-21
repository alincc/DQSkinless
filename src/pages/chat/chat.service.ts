import { Injectable } from '@angular/core';
import { DB } from '../../services';
import { DB_CONFIG, ONE_SIGNAL, CONFIG } from '../../config/config';
import { Storage, Push, HttpService, PUSH_TAGS } from '../../services';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChatServices{

	private clinicId : number;
	private userId : number;

	private recipientsList: any[];

	constructor(private db : DB,
		private storage : Storage,
		private http: HttpService,
		private push : Push
		){
	}

	private initConnections(inboxObserver){
		this.storage.accountSubject.subscribe(response => {
			this.userId = response.userId;
			this.refreshInbox().then(response => {
				inboxObserver.next(response);
			});
		});
		this.storage.clinicSubject.subscribe(response => {
			this.clinicId = response.clinicId;
			this.refreshInbox().then(response => {
				inboxObserver.next(response);
			});
		});
		this.push.subscribeToRecievedPush(ONE_SIGNAL.PUSH_TYPE.MESSAGES).subscribe(payload => {
			this.db.executeSQL(DB_CONFIG.SQL.STORE_TO_INBOX, payload.title , payload.body, null, payload.additionalData.clinic, this.userId )
			.then(response => {
				this.refreshInbox().then(_response => {
					inboxObserver.next(_response);
				});
			}).catch(err => {
				console.error(err);
			});
		});
		this.getRecipientsList();
	}

	private refreshInbox() : Promise<any>{
		if(this.userId && this.clinicId){
			return this.db.executeSQL(DB_CONFIG.SQL.GET_INBOX,
					this.clinicId, this.userId, DB_CONFIG.MESSAGE_LIMIT );
		}else{
			return Promise.reject("incomplete parameter");
		}
	}
	
	public getInbox() : Observable<any>{
		return Observable.create(inboxObserver=>{
			this.initConnections(inboxObserver);
		}).share();
	}

	public sendMessage(msg){
		return new Promise((resolve, reject) => {
			this.getRecipientsList().subscribe(response =>{
				let accountTag : any[];
				response.result.forEach(item=>{
					if(item.userId !== this.userId){
						if(accountTag){
							accountTag.push({operator: "OR"});
							accountTag.push([{field:"tag", key: PUSH_TAGS.USER_ID, relation: "=", value: item.userId}]);
						}else{
							accountTag = [{field:"tag", key: PUSH_TAGS.USER_ID, relation: "=", value: item.userId}];
						}
					}
				})
	        	let details = this.storage.userDetails;
	        	let title = details.lastname + ", " + details.firstname + " " + details.middleName;
	        	this.push.sendMessage(title, msg, accountTag).then( response => {
	        		console.log(response);
        			resolve(response);
	        	}, err => {
	        		reject(err);
	        	})
	        }, err => {
	        	reject(err);
	        })
		});
	}

	public getRecipientsList(){
        return this.http.get(CONFIG.API.getClinicMember, [this.clinicId]);
	}
}