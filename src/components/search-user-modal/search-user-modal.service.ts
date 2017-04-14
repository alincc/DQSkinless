import { Injectable } from '@angular/core';
import { HttpService, Storage } from '../../services/services';
import { CONFIG } from '../../config/config'

@Injectable()
export class SearchUserModalService {
    constructor(
        private http: HttpService,
        private storage: Storage) {

    }

    public getUsers(param) {
        // return this.http.get(CONFIG.API.getUsers);

        return [
            {
                lastName: 'last name',
                firstName: 'first name',
                middleName: 'middle name',
                email: 'user1@user.com',
                contactNo: '9111111'
            },
            {
                lastName: 'last name2',
                firstName: 'first name2',
                middleName: 'middle name2',
                email: 'user2@user.com',
                contactNo: '9222222'
            }
        ]
    }
}