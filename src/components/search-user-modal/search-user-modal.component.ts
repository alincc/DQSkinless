import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertController, NavParams, ViewController } from "ionic-angular";

import { SearchUserModalService } from './search-user-modal.service';

@Component({
    selector: 'search-user-modal',
    templateUrl: 'search-user-modal.html',
    providers: [SearchUserModalService]
})
export class SearchUserModal implements OnInit {

    public searchForm: FormGroup;
    public users: any;

    private message: any;
    private role: any;

    constructor(
        private alertController: AlertController,
        private formBuilder: FormBuilder,
        private params: NavParams,
        private viewController: ViewController,
        private searchUserModalService: SearchUserModalService) {
        this.getDefaults();
    }

    public ngOnInit() {
        this.createSearchForm();
    }

    private getDefaults() {
        this.users = [];
        this.message = this.params.data && this.params.data.message ? this.params.data.message : 'Select';
        this.role = this.params.data && this.params.data.role ? this.params.data.role : 0;
    }

    private createSearchForm() {
        this.searchForm = this.formBuilder.group({
            username: '',
            lastname: '',
            firstname: ''
        });
    }

    public search(event) {
        this.searchUserModalService.getUsers(this.searchForm.value, this.role).subscribe(response => {
            if (response) {
                this.users = this.removeMySelf(response);
            }
            event.dismissLoading()
        });
    }

    private removeMySelf(users) {
        if (users) {
            return users.filter(user => user.userId !== this.searchUserModalService.getUserId());
        }

        return users
    }

    public selectUser(user) {
        this.alertController.create({
            message: `${this.message} ${user.lastname ? this.getFullName(user) : user.email}?`,
            buttons: [
                {
                    text: 'NO',
                    role: 'cancel',
                },
                {
                    text: 'YES',
                    handler: () => {
                        this.viewController.dismiss(user).catch(() => { });
                    }
                }
            ]
        }).present();
    }

    public getDefaultAvatar(member) {
        if (member && member.lastname) {
            return member.lastname.substring(0, 1).toUpperCase() + member.firstname.substring(0, 1).toUpperCase();
        } else {
            return "?";
        }
    }

    public getFullName(user) {
        return (user.lastname ? user.lastname + ', ' : '') + (user.firstname ? user.firstname + ' ' : '') + ' ' + (user.middlename ? user.middlename : '');
    }

    public displayContacts(userContacts) {
        if (userContacts && userContacts.length > 0) {
            let formattedUserContacts = '';

            userContacts.forEach(userContact => {
                formattedUserContacts += `${userContact.contact}, `;
            });
            return formattedUserContacts.substring(1, formattedUserContacts.length - 2);
        }
        return '';
    }
}
