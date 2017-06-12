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

    public createPatient(_parameter) {
        return this.http.post(CONFIG.API.customPatient, _parameter);
    }

    public addContacts(_parameter) {
        return this.http.post(CONFIG.API.patientContacts, _parameter);
    }

    public deleteContacts(_parameter) {
        return this.http.delete(CONFIG.API.patientContacts, _parameter);
    }
}