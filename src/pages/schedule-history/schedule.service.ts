import { Injectable } from '@angular/core';
import { WebSocketFactory, HttpService } from '../../services/services';
import { CONFIG } from '../../config/config';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ScheduleService {
	constructor(private websocketFactory: WebSocketFactory,
		private http: HttpService) { }

	public getQueueBoardByClinicAndDateNoCreate(clinicId, date) {
		return this.http.get(CONFIG.API.queueBoard, [clinicId, date]);
	}
	public connectToQueue(): any {
		return this.websocketFactory.connect(CONFIG.SOCKETS.queue);
	}
	
	public getQueueByBoardID(boardId){
		return this.http.get(CONFIG.API.queue, boardId, {silentError: true});
	}
}