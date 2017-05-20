import { Injectable } from '@angular/core';
import { HttpService, Storage } from '../../services';
import { CONFIG } from '../../config/config'

@Injectable()
export class ForgotPasswordModalService {
    constructor(
        private http: HttpService,
        private storage: Storage) {

    }

    public resetPassword(username) {
        const payload = {
            username: username
        };
        
        return this.http.put(CONFIG.API.resetPassword, payload);
    }
}