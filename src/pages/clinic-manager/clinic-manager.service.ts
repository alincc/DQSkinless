import { Injectable } from '@angular/core';
import { HttpService, Storage } from '../../services/services';
import { CONFIG } from '../../config/config';

@Injectable()
export class ClinicManagerService {
    constructor(
        private http: HttpService,
        private storage: Storage) { }

    private userId;

    private getUserId() {
        if (!this.userId) {
            this.userId = this.storage.userDetails.userId;
        }
        return this.userId;
    }

    public getNoOfClinics() {
        return this.http.get(CONFIG.API.getNoOfClinics, [this.getUserId()]);
    }

    public getUserContacts() {
        return this.http.get(CONFIG.API.getUserContacts, [this.getUserId()]);
    }

    public createClinic(clinic) {
        clinic.userId = this.getUserId();
        return this.http.post(CONFIG.API.createClinic, clinic);
    }

    public getClinicAccessByUserId() {
        return this.http.get(CONFIG.API.getClinicAccessByUserId, [this.getUserId()]);
    }
}