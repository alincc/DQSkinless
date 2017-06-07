import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavParams, ViewController } from "ionic-angular";

import { SearchUserModalService } from './search-user-modal.service';

import { LOVS } from '../../constants/constants';
import { Utilities } from '../../utilities/utilities';

@Component({
    selector: 'search-user-modal',
    templateUrl: 'search-user-modal.html',
    providers: [SearchUserModalService]
})
export class SearchUserModal implements OnInit {

    public searchForm: FormGroup;
    public criteriaTypes: any;
    public selectedCriteriaType: any;
    public errors: any;
    public users: any;
    public haveSearched: boolean;

    private message: any;
    private pageHeader: any;
    private role: any;

    public criteria: AbstractControl;
    public username: AbstractControl;
    public lastname: AbstractControl;
    public firstname: AbstractControl;

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
        this.pageHeader = this.params.data && this.params.data.pageHeader ? this.params.data.pageHeader : 'Search User';
        this.role = this.params.data && this.params.data.role ? this.params.data.role : 0;
        this.criteriaTypes = LOVS.SEARCH_BY;
        this.selectedCriteriaType = 3;
        this.errors = {
            criteria: '',
            username: '',
            lastname: '',
            firstname: ''
        };
        this.haveSearched = false;
    }

    private createSearchForm() {
        this.searchForm = this.formBuilder.group({
            criteria: ['', Validators.required],
            username: '',
            lastname: '',
            firstname: ''
        });

        this.criteria = this.searchForm.get('criteria');
        this.username = this.searchForm.get('username');
        this.lastname = this.searchForm.get('lastname');
        this.firstname = this.searchForm.get('firstname');
    }

    private removeMySelf(users) {
        if (users) {
            return users.filter(user => user.userId !== this.searchUserModalService.getUserId());
        }

        return users
    }

    public getDefaultAvatar(member) {
        if (member && member.lastname) {
            return member.lastname.substring(0, 1).toUpperCase() + member.firstname.substring(0, 1).toUpperCase();
        } else {
            return "?";
        }
    }

    public getFullName(user) {
        return Utilities.getFullName(user);
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

    public selectCriteria(response) {
        this.selectedCriteriaType = response;
        this.username.setValue('');
        this.username.setErrors(null);
        this.lastname.setValue('');
        this.lastname.setErrors(null);
        this.firstname.setValue('');
        this.firstname.setErrors(null);
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

    private validateForm() {
        this.errors.criteria = this.criteria.hasError('required') ? 'Search By is requried' : '';

        if (this.selectedCriteriaType === 0) {
            this.username.markAsDirty();

            if (this.username.value === '') {
                this.errors.username = 'Username is requried';
                this.username.setErrors({ required: true });
            } else {
                this.username.setErrors(null);
            }
        } else if (this.selectedCriteriaType === 1) {
            this.lastname.markAsDirty();

            if (this.lastname.value === '') {
                this.errors.lastname = 'Last Name is requried';
                this.lastname.setErrors({ required: true });
            } else {
                this.username.setErrors(null);
            }
        } else if (this.selectedCriteriaType === 2) {
            this.firstname.markAsDirty();

            if (this.firstname.value === '') {
                this.errors.firstname = 'First Name is requried';
                this.firstname.setErrors({ required: true });
            } else {
                this.firstname.setErrors(null);
            }
        }
    }

    public search(event) {
        this.criteria.markAsDirty();
        this.validateForm();
        if (this.searchForm.valid) {
            this.haveSearched = true;
            this.searchUserModalService.getUsers(this.searchForm.value, this.role).subscribe(response => {
                if (response) {
                    this.users = this.removeMySelf(response);
                }
                event.dismissLoading()
            });
        } else {
            event.dismissLoading();
        }
    }
}
