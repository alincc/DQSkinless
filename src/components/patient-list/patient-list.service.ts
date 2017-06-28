import { Injectable } from '@angular/core';
import { HttpService, Storage } from '../../services';
import { CONFIG } from '../../config/config'

@Injectable()
export class PatientListService {

    constructor(
        private http: HttpService,
        private storage: Storage) { }

    private patientOwner;

    private getPatientOwner() {
        if (!this.patientOwner) {
            this.storage.patientOwnerSubject.subscribe(patientOwner => {
                if (patientOwner) {
                    this.patientOwner = patientOwner;
                }
            });
        }
        return this.patientOwner;
    }

    public seachPatient(name, page, limit) {
        const payload = {
            name: name,
            page: page,
            limit: limit,
            ownerId: this.getPatientOwner()
        };

        return this.http.post(CONFIG.API.searchPatient, payload);
    }
}