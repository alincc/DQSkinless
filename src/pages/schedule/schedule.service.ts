import { Injectable } from '@angular/core';
import { WebSocketFactory, HttpService } from '../../services';
import { CONFIG } from '../../config/config';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ScheduleService{

	constructor( private websocketFactory : WebSocketFactory,
		private http : HttpService){}
	
	public connectToQueue() : any{
		return this.websocketFactory.connect(CONFIG.SOCKETS.queue);
	}

	public getQueueBoardByIdAndClinic(clinicId , date){
		return this.http.get(CONFIG.API.queueBoard, [clinicId, date]);
	}

	
	public getQueueByBoardID(boardId){
		return this.http.get(CONFIG.API.queue, boardId, {silentError: true});
	}

	public addQueue(queue: any){
		return this.http.post(CONFIG.API.queue, queue);
	}

	public updateQueue(queue: any){
		return this.http.put(CONFIG.API.queue, queue);
	}



}