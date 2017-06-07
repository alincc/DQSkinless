import { Injectable } from '@angular/core';
import { HttpService, Storage } from '../../services';
import { CONFIG } from '../../config/config';

@Injectable()
export class PatientManagerService {

    constructor(
        private http: HttpService,
        private storage: Storage) { }

    public createPatientAccess(payload) {
        return this.http.post(CONFIG.API.patientAccess, payload);
    }
}