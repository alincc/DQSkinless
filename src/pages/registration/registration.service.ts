import { Injectable } from '@angular/core';
import { HttpService, Storage } from '../../services/services';
import { CONFIG } from '../../config/config'

@Injectable()
export class RegistrationService {
    constructor(
        private http: HttpService,
        private storage: Storage) { }


    public changePassword(changePasswordFormValue) {
        let _parameter = {
            username: this.storage.userDetails.username,
            oldPassword: changePasswordFormValue.oldPassword,
            newPassword: changePasswordFormValue.password
        }
        return this.http.post(CONFIG.API.changePassword, _parameter)
            .map(response => {
                return response;
            });
    }
}