import { Injectable } from '@angular/core';
import { WebSocketFactory, HttpService } from '../../services/services';
import { CONFIG } from '../../config/config';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ScheduleService{

	constructor( private websocketFactory : WebSocketFactory,
		private http : HttpService){}
	
	public connectToQueue() : any{
		return this.websocketFactory.connect(CONFIG.SOCKETS.queue);
	}

	public getCurrentQueueBoard(clinicId , date){
		
		return this.http.get(CONFIG.API.queueBoard, [clinicId, date], {silentError: true});
	}

	public createQueueBoard(queueBoard){
		return this.http.post(CONFIG.API.queueBoard,queueBoard);
	}

}