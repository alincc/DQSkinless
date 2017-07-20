import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';

import { HttpService, Storage } from '../../services';
import { CONFIG } from '../../config/config';

@Injectable()
export class SearchUserModalService {

    private userId: any;
    constructor(
        private http: HttpService,
        private storage: Storage) {

    }

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


    public getUsers(criteria, role, page, limit) {
        if (role === 1) {
            const doctorCriteria = this.createCriteria(criteria, 1, page, limit);
            this.transformCriteria(doctorCriteria);

            return this.getDoctors(doctorCriteria);
        } else if (role === 2) {
            const assistantCriteria = this.createCriteria(criteria, 2, page, limit);
            this.transformCriteria(assistantCriteria);

            return this.getAssistants(assistantCriteria);
        } else {
            const allCriteria = this.createCriteria(criteria, undefined, page, limit);
            this.transformCriteria(allCriteria);

            return this.getAll(allCriteria);
        }
    }

    private getDoctors(criteria) {
        return this.http.post(CONFIG.API.searchUser, criteria);
    }

    private getAssistants(criteria) {
        return this.http.post(CONFIG.API.searchUser, criteria);
    }

    private getAll(criteria) {
        return this.http.post(CONFIG.API.searchUser, criteria);
    }

    private createCriteria(criteria, role, page, limit) {
        return {
            username: criteria.username,
            firstname: criteria.firstname,
            lastname: criteria.lastname,
            role: role,
            page: page,
            limit: limit
        };
    }

    private transformCriteria(criteria) {
        if (criteria.username.trim() === '') {
            delete criteria.username;
        }

        if (criteria.firstname.trim() === '') {
            delete criteria.firstname;
        }

        if (criteria.lastname.trim() === '') {
            delete criteria.lastname;
        }
    }
}