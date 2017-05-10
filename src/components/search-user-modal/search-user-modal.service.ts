import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';

import { HttpService, Storage } from '../../services/services';
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
            this.storage.accountSubject.subscribe( account => {
                this.userId = account.userId;
            })
        }
        return this.userId;
    }


    public getUsers(criteria, role) {
        const doctorCriteria = this.createCriteria(criteria, 1);
        const assistantCriteria = this.createCriteria(criteria, 2);
        this.transformCriteria(doctorCriteria);
        this.transformCriteria(assistantCriteria);

        if (role === 1) {
            return this.getDoctors(doctorCriteria);
        } else if (role === 2) {
            return this.getAssistants(assistantCriteria);
        } else {
            const users = [];

            return Observable.forkJoin([
                this.getDoctors(doctorCriteria),
                this.getAssistants(assistantCriteria)
            ]).flatMap((data: any[]) => {

                const doctors = data[0];
                const assistants = data[1];

                if (doctors && doctors.status) {
                    doctors.result.forEach(doctor => users.push(doctor));
                }

                if (assistants && assistants.status) {
                    assistants.result.forEach(assistant => users.push(assistant));
                }

                return Observable.of(users);
            });
        }
    }

    private getDoctors(criteria) {
        criteria.role = 1;
        return this.http.post(CONFIG.API.searchUser, criteria);
    }

    private getAssistants(criteria) {
        criteria.role = 2;
        return this.http.post(CONFIG.API.searchUser, criteria);
    }

    private createCriteria(criteria, role) {
        return {
            username: criteria.username,
            firstname: criteria.firstname,
            lastname: criteria.lastname,
            role: role
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