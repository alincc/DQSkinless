import { Injectable } from '@angular/core';
import { HttpService, Storage } from '../../services';
import { CONFIG } from '../../config/config'

@Injectable()
export class PatientFormService {
    constructor(
        private http: HttpService,
        private storage: Storage) { }


   public getPatientAllergy(patientId) {
        return this.http.get(CONFIG.API.patientDetails, patientId);
    }     
}