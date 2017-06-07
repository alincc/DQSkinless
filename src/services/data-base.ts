import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Storage } from './storage';
import { DB_CONFIG } from '../config/config';


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
					name: DB_CONFIG.DB_NAME,
					location:  DB_CONFIG.LOCATION
				}).then((session : SQLiteObject ) => {
					session.executeSql(DB_CONFIG.SQL.CREATE, {})
					.then(() => {
						this.session = session;
						resolve(this.session);
					}).catch(reject)
				}).catch(reject);
			}
		})
	}

	public executeSQL(sql: string , ...parameter){
		return new Promise((resolve, reject) => {
			this.openSession().then( session => {
				session.executeSql(sql,parameter)
				.then(response => {
					resolve(response)
				})
				.catch(err => {
					reject(err);
				});
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