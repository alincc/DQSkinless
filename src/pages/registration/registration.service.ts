import { Injectable } from '@angular/core';
import { HttpService, Storage } from '../../services/services';
import { CONFIG } from '../../config/config'

@Injectable()
export class RegistrationService {
    constructor(
        private http: HttpService,
        private storage: Storage) { }


    updateStatus(status){
        return this.http.put(CONFIG.API.changeStatus, {
            userId : this.storage.account.userId,
            status : status
        });
    }
}