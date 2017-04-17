import { Injectable } from '@angular/core';
import { HttpService, Storage } from '../../services/services';
import { CONFIG } from '../../config/config'

@Injectable()
export class AccountCreationModalService {
    constructor(
        private http: HttpService,
        private storage: Storage) {

    }

    public createAccount(email) {
        const payload = {
            username: email,
            role: 2,
            noOfClinic: null
        };

        return this.http.post(CONFIG.API.createAccount, payload);
    }
}