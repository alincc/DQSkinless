import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ClinicManagerService } from '../clinic-manager.service';
import { RootNavController } from '../../../services';

@Component({
    selector: 'clinic-affiliation',
    templateUrl: 'clinic-affiliation.html',
    providers: [ClinicManagerService]
})
export class ClinicAffiliationPage implements OnInit {

    public affiliateForm: FormGroup;

    public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private affiliateName: AbstractControl;
    private affiliateCode: AbstractControl;

    private affiliateId: any;
    private clinic: any;
    private loading: any;

    constructor(
        private formBuilder: FormBuilder,
        private alertController: AlertController,
        private loadingController: LoadingController,
        private params: NavParams,
        private clinicManagerService: ClinicManagerService,
        private rootNav: RootNavController) { }

    public ngOnInit() {
        this.clinic = this.params.get('clinic') ? Object.assign({}, this.params.get('clinic')) : {};
        this.affiliateId = this.clinic.affiliateId;
        this.createAffiliateForm();

        if (this.affiliateId) {
            this.isLoading.next(true);
            this.clinicManagerService.getAffiliate(this.affiliateId).subscribe(response => {
                if (response && response.status) {
                    this.bindAffiliateFormValues(response.result);
                }

                this.isLoading.next(false);
            }, err => this.isLoading.next(false));
        }
    }

    private bindAffiliateFormValues(affiliate) {
        this.affiliateName.setValue(affiliate.affiliateName);
        this.affiliateCode.setValue(affiliate.affiliateName);
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

    private markFormAsDirty() {
        Object.keys(this.affiliateForm.controls).forEach(key => {
            this.affiliateForm.get(key).markAsDirty();
        });
    }

    private updateAffiliate(affiliateId) {
        const modifiedClinic = {
            clinicId: this.clinic.clinicId,
            clinicName: this.clinic.clinicName,
            address: this.clinic.address,
            affiliateId: affiliateId
        };

        return this.clinicManagerService.updateClinicDetailRecord(modifiedClinic);
    }

    private popPage(response) {
        const callback = this.params.get('callback');
        callback(response).then(() => {
            this.rootNav.pop();
        });
    }

    public submitForm(event) {
        this.markFormAsDirty();

        if (this.affiliateName.value) {
            this.clinicManagerService.verifyAffiliateCode(this.affiliateForm.value).flatMap(response => {
                if (response && response.status) {
                    return this.updateAffiliate(response.result);
                }
                return Observable.of(response);
            }).subscribe(response => {
                if (response && response.status) {
                    this.popPage(response);
                }
                event.dismissLoading();
            }, err => event.dismissLoading());
        } else {
            event.dismissLoading();
            this.alertController.create({
                message: `Remove Affiliation?`,
                buttons: [
                    {
                        text: 'NO',
                        role: 'cancel',
                    },
                    {
                        text: 'YES',
                        handler: () => {
                            this.showLoading();
                            // TODO remove affiliation
                            this.updateAffiliate(null).subscribe(response => {
                                if (response && response.status) {
                                    this.popPage(response);
                                }
                                this.dismissLoading();
                            }, err => this.dismissLoading());
                        }
                    }
                ]
            }).present();
        }
    }
}