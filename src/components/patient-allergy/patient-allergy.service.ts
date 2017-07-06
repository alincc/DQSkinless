import { Injectable } from '@angular/core';
import { HttpService, Storage } from '../../services';
import { CONFIG } from '../../config/config'

@Injectable()
export class PatientAllergyService {
    constructor(
        private http: HttpService,
        private storage: Storage) { }


    public getPatientAllergy(patientId) {
        return this.http.get(CONFIG.API.patientAllergy, patientId);
    }
    
    public createPatientAllergy(patientAllergy){
        return this.http.post(CONFIG.API.patientAllergy, patientAllergy);
    }

    public deletePatientAllergyRecord(patientAllergyId){
        return this.http.delete(CONFIG.API.patientAllergy, patientAllergyId);
    }
}