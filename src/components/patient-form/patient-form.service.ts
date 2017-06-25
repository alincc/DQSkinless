import { Injectable } from '@angular/core';
import { HttpService, Storage } from '../../services';
import { CONFIG } from '../../config/config'

@Injectable()
export class PatientFormService {
    constructor(
        private http: HttpService,
        private storage: Storage) { }

    private userId;

    public getUserId() {
        if (!this.userId) {
            this.storage.accountSubject.subscribe(account => {
                if (account) {
                    this.userId = account.userId;
                }
            });
        }
        return this.userId;
    }

    public addPatientDetails(_parameter) {
        return this.http.post(CONFIG.API.patientDetails, _parameter);
    }

    public setPatientDetails(_patient) {
        return this.http.put(CONFIG.API.patientDetails, _patient);
    }

    public createPatientAcess(ownerId, patientId) {
        const payload = {
            ownerId: ownerId,
            patientId: patientId,
            startDate: new Date(),
            endDate: null,
            access: 1, // TODO
            type: 0
        };

        return this.http.post(CONFIG.API.patientAccess, payload);
    }
    public createPatient(_parameter) {
        return this.http.post(CONFIG.API.customPatient, _parameter);
    }

    public addContacts(_parameter) {
        return this.http.post(CONFIG.API.patientContacts, _parameter);
    }

    public getPatientDetails(patientId) {
        return this.http.get(CONFIG.API.patientDetails, [patientId]);
    }
    public deleteContacts(_parameter) {
        return this.http.delete(CONFIG.API.patientContacts, [_parameter]);
    }

    public getPatientContactDetails(patientId){
        return this.http.get(CONFIG.API.getpatientContacts, [patientId]);
    }
}