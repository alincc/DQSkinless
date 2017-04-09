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
        return this.http.get(CONFIG.API.getNoOfClinics, this.getUserId());
    }

    public getUserContacts() {
        return this.http.get(CONFIG.API.userContacts, this.getUserId());
    }
}