import { Injectable } from '@angular/core';
import { HttpService } from '../../services';
import { CONFIG } from '../../config/config';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ScheduleService {
	constructor(private http: HttpService) { }

	public getQueueBoardByClinicAndDateNoCreate(clinicId, date) {
		return this.http.get(CONFIG.API.queueBoard, [clinicId, date]);
	}
	
	public getQueueByBoardID(boardId){
		return this.http.get(CONFIG.API.queue, boardId, {silentError: true});
	}
}