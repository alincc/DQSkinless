import { Injectable } from '@angular/core';
import { WebSocketFactory, HttpService } from '../../services';
import { CONFIG } from '../../config/config';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PatientProfileService{

    constructor(private websocketFactory: WebSocketFactory,
		private http: HttpService) { }

    public getPatientDetails(patientId) {
        return this.http.get(CONFIG.API.patientDetails, [patientId]);
	}
}