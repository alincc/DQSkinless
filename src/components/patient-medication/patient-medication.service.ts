import { Injectable } from '@angular/core';
import { HttpService, Storage } from '../../services';
import { CONFIG } from '../../config/config'

@Injectable()
export class PatientMedicationService {
    constructor(
        private http: HttpService,
        private storage: Storage) { }


    public getPatientMedicationByPatientId(patientId) {
        return this.http.get(CONFIG.API.patientMedication, patientId);
    }
    
    public createPatientMedication(patientMedication){
        return this.http.post(CONFIG.API.patientMedication, patientMedication);
    }

    public deletePatientMedicationById(patientMedicationId){
        return this.http.delete(CONFIG.API.patientMedication, patientMedicationId);
    }
}