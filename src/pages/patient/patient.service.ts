import { Injectable } from '@angular/core';
import { HttpService, Storage } from '../../services';
import { CONFIG } from '../../config/config';
import { Observable } from 'rxjs/Observable';

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

    public getPatients() {
        // TODO
        
    }
}