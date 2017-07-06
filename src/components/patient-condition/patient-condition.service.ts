import { Injectable } from '@angular/core';
import { HttpService, Storage } from '../../services';
import { CONFIG } from '../../config/config'

@Injectable()
export class PatientConditionService {
    constructor(
        private http: HttpService,
        private storage: Storage) { }


    public getPatientConditionByPatientId(patientId) {
        return this.http.get(CONFIG.API.patientCondition, patientId);
    }
    
    public createPatientCondition(patientCondition){
        return this.http.post(CONFIG.API.patientCondition, patientCondition);
    }

    public deletePatientConditionById(patientConditionId){
        return this.http.delete(CONFIG.API.patientCondition, patientConditionId);
    }
}