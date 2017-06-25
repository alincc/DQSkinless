import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';

import { HttpService, Storage } from '../../services';
import { CONFIG } from '../../config/config';

@Injectable()
export class PatientInformationService {

    constructor(
        private http: HttpService,
        private storage: Storage) { }

    private username;

    private getUserName() {
        if (!this.username) {
            this.storage.accountSubject.subscribe(account => {
                if (account) {
                    this.username = account.username;
                }
            });
        }
        return this.username;
    }

    public verifyPassword(password) {
        const payload = {
            username: this.getUserName(),
            password: password
        };

        return this.http.post(CONFIG.API.verifyPassword, payload);
    }
}