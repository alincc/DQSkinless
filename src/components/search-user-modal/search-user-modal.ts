import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertController, ViewController } from "ionic-angular";

import { SearchUserModalService } from './search-user-modal.service';

@Component({
    selector: 'search-user-modal',
    templateUrl: 'search-user-modal.html',
    providers: [SearchUserModalService]
})
export class SearchUserModal implements OnInit {

    public searchForm: FormGroup;
    public users: any;

    constructor(
        private alertController: AlertController,
        private formBuilder: FormBuilder,
        private viewController: ViewController,
        private searchUserModalService: SearchUserModalService) {
        this.getDefaults();
    }

    public ngOnInit() {
        this.createSearchForm();
    }

    private getDefaults() {
        this.users = [];
    }

    private createSearchForm() {
        this.searchForm = this.formBuilder.group({
            userName: '',
            lastName: '',
            firstName: ''
        });
    }

    public search(event) {
        // TODO
        // this.searchUserModalService.getUsers(this.searchForm.value).subscribe(response => {
        //     if (response && response.status) {
        //         console.log(JSON.stringify(response));
        //     }
        // });

        this.users = this.searchUserModalService.getUsers(this.searchForm.value);

        event.dismissLoading();
    }

    public selectUser(user) {
        this.alertController.create({
            message: `Select ${this.getFullName(user)}?`,
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
    
    public getFullName(user) {
        return (user.lastName ? user.lastName + ', ' : '') + user.firstName + ' ' + (user.middleName ? user.middleName : '');
    }
}
