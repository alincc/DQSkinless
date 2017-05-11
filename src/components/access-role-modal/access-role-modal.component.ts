import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingController, NavParams, ViewController } from 'ionic-angular';

import { AccessRoleModalService } from './access-role-modal.service';

import { LOVS } from '../../constants/constants'
import { Utilities } from '../../utilities/utilities';

@Component({
    selector: 'access-role-modal',
    templateUrl: 'access-role-modal.html',
    providers: [AccessRoleModalService]
})
export class AccessRoleModal implements OnInit {

    public accessForm: FormGroup;
    public accessRoles: any;

    private loading: any;
    private member: any;

    constructor(
        private formBuilder: FormBuilder,
        private loadingController: LoadingController,
        private params: NavParams,
        private viewController: ViewController,
        private accessRoleModalService: AccessRoleModalService) {
        this.getDefaults();
    }

    public ngOnInit() {
        this.createAccessForm();
        this.bindProfileFormValues();
    }

    private getDefaults() {
        this.accessRoles = [];
        this.accessRoles = this.accessRoles.concat(LOVS.ACCESS_ROLES);
        this.accessRoles.splice(0, 1);
        this.member = this.params.get('member') ? Object.assign({}, this.params.get('member')) : {};
    }

    private createAccessForm() {
        this.accessForm = this.formBuilder.group({
            accessRole: '',
            roleExpiryDate: ''
        });
    }

    private bindProfileFormValues() {
        this.accessForm.get('accessRole').setValue(this.member.accessRole);
        this.accessForm.get('roleExpiryDate').setValue(this.member.roleExpiryDate);
    }

    private showLoading() {
        this.loading = this.loadingController.create({
            spinner: 'crescent',
            cssClass: 'xhr-loading'
        });
        this.loading.present();
    }


    private dismissLoading() {
        if (this.loading) {
            this.loading.dismiss();
        }
    }

    public getMinDate(): any {
        let dateNow = Utilities.clearTime(new Date());
        dateNow.setDate(dateNow.getDate() + 1);
        const month = dateNow.getMonth().toString();
        return dateNow.getFullYear() + '-' + (month.length < 2 ? '0' : '') + month + '-' + dateNow.getDate();
    }

    public save() {
        // TODO saving
        this.viewController.dismiss(this.accessForm.value).catch(() => { });
    }
}