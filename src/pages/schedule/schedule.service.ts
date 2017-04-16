import { Injectable } from '@angular/core';
import { WebSocketFactory } from '../../services/services';
import { CONFIG } from '../../config/config';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ScheduleService{

	constructor( private websocketFactory : WebSocketFactory){}
	
	public connectToQueue() : any{
		return this.websocketFactory.connect(CONFIG.SOCKETS.queue);
	}

}