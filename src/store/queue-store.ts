import { Injectable } from '@angular/core';
import { Storage,WebSocketFactory, HttpService } from '../services';
import { CONFIG } from '../config/config';
import { Utilities } from '../utilities/utilities';
import { QUEUE } from '../constants/constants';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class QueueStore{

	private ws;
	private connection;
	private requestForRefresh: any;

	private _queueBoard: any;
	private _queueBoardSubject = new BehaviorSubject<any>(undefined);
	public queueBoardSubject: Observable<any> = this._queueBoardSubject.asObservable();

	public get queueBoard() {
		return this._queueBoard;
	}

	public set queueBoard(data) {
		this._queueBoardSubject.next(data);
		this._queueBoard = data;
	}

	//Queue Patient
	private _queueList: any;
	public queueListSubject = new BehaviorSubject<any>(undefined);

	public get queueList() {
		return this._queueList;
	}

	public set queueList(data) {
		this.queueListSubject.next(data);
		this._queueList = data;
	}

	constructor(private storage : Storage,
		private websocketFactory : WebSocketFactory,
		private http : HttpService){


		this.storage.clinicSubject.subscribe(clinic => {
			this.disconnect();
			if(clinic){
				this.initStore(clinic);
			}
		});
	}
	private initStore(clinic){
		let currentDate = Utilities.clearTime(new Date());
		this.http.get(CONFIG.API.queueBoard, [clinic.clinicId, currentDate]).subscribe(response => {
			if(response.status){
				this.queueBoard = response.result;
				this.connectToQueue(clinic.clinicId).subscribe(_response=>{
					console.log("subcsribed to sock with response ", _response);
					if (_response === "A") {
						console.log("fetching Queue");
						this.fetchQueue();
					} else {
						if (this.requestForRefresh) {
							clearTimeout(this.requestForRefresh);
						}
						this.requestForRefresh = setTimeout(() => {
							this.requestForRefresh = null;
							this.fetchQueue();
						}, 3000);
					}
				});
			}
		})
	}

	private connectToQueue(clinicId){
		
		this.ws = this.websocketFactory.connect(CONFIG.SOCKETS.queue)
		this.ws.then(
			response => {
				this.ws.send(clinicId);
			}
		);
		return this.ws.connection;
	}

	private disconnect(){
		if (this.ws) {
			this.ws.close();
		}
	}

	public fetchQueue(callback?, reject?) {
		let account = this.storage.account;
		return this.http.get(CONFIG.API.queue, this.queueBoard.id, { silentError: true }).subscribe(response => {
			if (response.status) {
				this.queueList = response.result;
				if(callback){
					callback(response);
				}else if(reject){
					reject(response);
				}
			}else if(reject){
				reject(response);
			}
		}, err => {
			console.log(err);
			if(reject){
				reject(err);
			}
		})
	}


	public send(msg){
		this.ws.send(msg);
	}



}