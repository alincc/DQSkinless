import { Injectable } from '@angular/core';
import { HttpService, Storage } from '../../services/services';
import { CONFIG } from '../../config/config'
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProfileFormService {
    constructor(
        private http: HttpService,
        private storage: Storage) {

    }
    private userId;

    private getUserId() {
        if (!this.userId) {
            this.userId = this.storage.userDetails.userId;
        }
        return this.userId;
    }

    public setDoctorDetails(_parameter) {
        _parameter.userId = this.getUserId();
        return this.http.put(CONFIG.API.doctorDetails, _parameter);
    }

    public getDoctorDetails() {
        return this.http.get(CONFIG.API.doctorDetails, [this.getUserId()]);
    }

    public setAsistantDetails(_parameter) {
        _parameter.userId = this.getUserId();
        return this.http.put(CONFIG.API.assistantDetails, _parameter);
    }

    public getAssistantDetails() {
        return this.http.get(CONFIG.API.assistantDetails, [this.getUserId()]);
    }

    public addContacts(_parameter) {
        _parameter.userId = this.getUserId();
        return this.http.post(CONFIG.API.contacts, _parameter);
    }

    public deleteContacts(_parameter) {
        return this.http.delete(CONFIG.API.contacts, _parameter);
    }
}