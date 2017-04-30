import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';

import { HttpService, Storage } from '../../services/services';
import { CONFIG } from '../../config/config';

@Injectable()
export class AssistantManagerService {

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

    public associateMember(clinicId, userId) {
        const payload = {
            clinicId: clinicId,
            userId: userId,
            accessRole: 0,
            userRole: 1
        };

        return this.http.post(CONFIG.API.clinicaccess, payload);
    }

    public getAssistantsByClinic(clinicId) {
        return this.http.get(CONFIG.API.getAssistantsByClinic, [clinicId]);
    }
}