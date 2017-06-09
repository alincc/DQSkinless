import { Injectable } from '@angular/core';
import { HttpService, Storage } from '../../services';
import { CONFIG } from '../../config/config'

@Injectable()
export class PatientService {
    constructor(
        private http: HttpService,
        private storage: Storage) { }

    public addPatientDetails(_parameter) {
        return this.http.post(CONFIG.API.patientDetails, _parameter);
    }

    public addContacts(_parameter) {
        return this.http.post(CONFIG.API.patientContacts, _parameter);
    }
}