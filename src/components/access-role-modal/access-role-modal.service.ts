import { Injectable } from '@angular/core';
import { HttpService, Storage } from '../../services/services';
import { CONFIG } from '../../config/config'

@Injectable()
export class AccessRoleModalService {
    constructor(
        private http: HttpService,
        private storage: Storage) { }

    public updateAccessExpiryProcess(payload) {
        return this.http.put(CONFIG.API.updateAccessExpiryProcess, payload);
    }
}