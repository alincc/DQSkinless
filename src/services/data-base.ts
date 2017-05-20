import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Storage } from './storage';


interface Message{
	id : number,
	name : string,
	message : string,
	avatar? : string,
	clinicId : number
}

@Injectable()
export class DB{

	private session : SQLiteObject;
	private account : any;
	private clinic : any;
	constructor(private sql: SQLite,
		private storage : Storage){
		this.storage.accountSubject.subscribe(account => {
			if(account){
				this.account = account;
			}
		});

		this.storage.clinicSubject.subscribe(clinic => {
			if(clinic){
				this.clinic = clinic;
			}
		})
	}


	private openSession() : Promise<SQLiteObject>{
		return new Promise( (resolve, reject) => {
			if(this.session){
				resolve(this.session);
			}else{
				this.sql.create({
					name:"MedAppWS.db",
					location: 'default'
				}).then((session : SQLiteObject ) => {
					session.executeSql('create table if not exists messages(id integer primary key autoincrement, name varchar(15), date date, message varchar(500), avatar varchar(100) , clinic integer, account integer, status integer default 0)', {})
					.then(() => {
						this.session = session;
						resolve(this.session);
					}).catch(reject)
				}).catch(reject);
			}
		})
	}

	public storeMessage(payload : Message){
		return new Promise((resolve, reject) => {
			this.openSession().then( session => {
				session.executeSql('insert into messages(name,message,avatar, clinic, account) values (?,?,?,?,?)', [payload.name, payload.message, payload.avatar , payload.clinicId, this.account.id])
				.then(resolve)
				.catch(reject)
			}).catch(reject);
		})
	}

	public getMessages(){
		return new Promise((resolve, reject) => {
			this.openSession().then( session => {
				session.executeSql('select * from messages where clinic = ? and account = ?', [this.clinic.id, this.account.id])
				.then(resolve)
				.catch(reject)
			}).catch(reject);
		})
	}

	public markAsRead(id){
		return new Promise((resolve, reject) => {
			this.openSession().then( session => {
				session.executeSql('update messages set status = 1 where id = ?', [id])
				.then(resolve)
				.catch(reject)
			}).catch(reject);
		})
	}

	public count(id){
		return new Promise((resolve, reject) => {
			this.openSession().then( session => {
				session.executeSql('select sum(status), clinic from messages where account = ? group by clinic', [id])
				.then(resolve)
				.catch(reject)
			}).catch(reject);
		})
	}

}