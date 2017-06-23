import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';

import { HttpService, Storage } from '../../services';
import { CONFIG } from '../../config/config';

@Injectable()
export class ManagerService {

    constructor(
        private http: HttpService,
        private storage: Storage) { }

    private userId;

    private getUserId() {
        if (!this.userId) {
            this.storage.accountSubject.subscribe(account => {
                if (account) {
                    this.userId = account.userId;
                }
            });
        }
        return this.userId;
    }

    public getClinicRecordByUserId() {
        return this.http.get(CONFIG.API.getClinicRecordByUserId, [this.getUserId()]);
    }

    public getClinicAcessByUserIdAndClinicId(clinciId) {
        return this.http.get(CONFIG.API.clinicAccess, [`u/${this.getUserId()}`, `c/${clinciId}`]);
    }

    public getClinicOwner(clinicId) {
        return this.http.get(CONFIG.API.getClinicMember, [clinicId]).flatMap(response => {
            if (response && response.status) {
                const owner = response.result.find(m => m.accessRole === 0);
                return Observable.of(owner ? owner.userId : undefined);
            } else {
                return Observable.of(undefined);
            }
        });
    }
}