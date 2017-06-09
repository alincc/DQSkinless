import { Injectable } from '@angular/core';
import { HttpService, Storage } from '../../services';
import { CONFIG } from '../../config/config'

@Injectable()
export class PatientService {
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

    public createPatientAcess(patientId) {
        // TODO BE MODIFIED FOR PROPER IMPLEMENTATION
        const payload = {
            userId: this.getUserId(),
            patientId: patientId,
            startDate: new Date(),
            endDate: null,
            access: 1, // for 1 - doctor 2 - assistant
            type: 0 // refer to constants PD_RELATIONSHIP
        };

        return this.http.post(CONFIG.API.patientAccess, payload);
    }

    public addContacts(_parameter) {
        return this.http.post(CONFIG.API.patientContacts, _parameter);
    }
}