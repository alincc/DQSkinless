import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ViewController } from 'ionic-angular';

import { AccountCreationModalService } from './account-creation-modal.service';
import { REGEX } from '../../config/config';

@Component({
    selector: 'account-creation-modal',
    templateUrl: 'account-creation-modal.html',
    providers: [AccountCreationModalService]
})
export class AccountCreationModal implements OnInit {

    public assistantForm: FormGroup;
    public errors: any;

    private email: AbstractControl;
    private loading: any;

    constructor(
        private formBuilder: FormBuilder,
        private alertController: AlertController,
        private loadingController: LoadingController,
        private viewController: ViewController,
        private accountCreationModalService: AccountCreationModalService) {
        this.getDefaults();
    }

    private getDefaults() {
        this.errors = {
            email: ['', [Validators.required, Validators.pattern(REGEX.EMAIL)]],
        };
    }

    public ngOnInit() {
        this.createAssistantForm();
    }

    private createAssistantForm() {
        this.assistantForm = this.formBuilder.group({
            email: ''
        });

        this.email = this.assistantForm.get('email');

        this.email.valueChanges.subscribe(newValue => {
            this.errors.email = this.email.hasError('required') ? 'Email is required.' : this.email.hasError('pattern') ? 'Invalid email address format' : '';
        });
    }

    private validateForm() {
        this.errors.email = this.email.hasError('required') ? 'Email is required.' : this.email.hasError('pattern') ? 'Invalid email address format' : '';
    }

    public save() {
        this.validateForm();

        if (this.assistantForm.valid) {
            this.showLoading();
            this.accountCreationModalService.createAccount(this.email.value).subscribe(response => {
                if (response && response.status) {
                    this.alertController.create({
                        message: `Account created! Pre-generated password sent to ${this.email.value}`,
                        buttons: [
                            {
                                text: 'OK',
                                handler: () => {
                                    this.viewController.dismiss(response.result).catch(() => { });
                                }
                            }
                        ]
                    }).present();
                }
                this.dismissLoading();
            }, err => this.dismissLoading());
        }
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
}