import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavParams } from 'ionic-angular';

import { ClinicManagerService } from '../clinic-manager.service';

@Component({
    selector: 'clinic-affiliation',
    templateUrl: 'clinic-affiliation.html',
    providers: [ClinicManagerService]
})
export class ClinicAffiliationPage implements OnInit {

    public affiliateForm: FormGroup;
    public errors: any;

    private affiliateName: AbstractControl;
    private affiliateCode: AbstractControl;

    private affiliateId: any;
    private clinic: any;

    constructor(
        private formBuilder: FormBuilder,
        private alertController: AlertController,
        private params: NavParams,
        private clinicManagerService: ClinicManagerService) { }

    public ngOnInit() {
        this.clinic = this.params.get('clinic') ? Object.assign({}, this.params.get('clinic')) : {};
        this.affiliateId = this.clinic.affiliateId;
        this.createAffiliateForm();
    }

    private createAffiliateForm() {
        this.affiliateForm = this.formBuilder.group({
            affiliateName: '',
            affiliateCode: ''
        });

        this.affiliateName = this.affiliateForm.get('affiliateName');
        this.affiliateCode = this.affiliateForm.get('affiliateCode');

        this.affiliateName.valueChanges.subscribe(newValue => {
            this.affiliateCode.setValue('');
        });
    }

    private markFormAsDirty() {
        Object.keys(this.affiliateForm.controls).forEach(key => {
            this.affiliateForm.get(key).markAsDirty();
        });
    }

    private validateForm() {
        this.errors.affiliateName = this.affiliateName.hasError('required') ? 'Affiliate Name is required.' : '';
        this.errors.affiliateCode = this.affiliateCode.hasError('required') ? 'Affiliate Code is required.' : '';
    }

    public submitForm(event) {
        this.markFormAsDirty();
        this.validateForm();
        event.dismissLoading();
        // if (this.affiliateForm.valid) {
        //     this.showLoading();
        //     this.accountCreationModalService.createAccount(this.email.value).subscribe(response => {
        //         if (response && response.status) {
        //             this.alertController.create({
        //                 message: `Account created! Pre-generated password sent to ${this.email.value}`,
        //                 buttons: [
        //                     {
        //                         text: 'OK',
        //                         handler: () => {
        //                             this.viewController.dismiss(response.result).catch(() => { });
        //                         }
        //                     }
        //                 ]
        //             }).present();
        //         }
        //         this.dismissLoading();
        //     }, err => this.dismissLoading());
        // }
    }
}