import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ViewController } from 'ionic-angular';

import { ForgotPasswordModalService } from './forgot-password-modal.service';
import { REGEX } from '../../config/config';

@Component({
    selector: 'forgot-password-modal',
    templateUrl: 'forgot-password-modal.html',
    providers: [ForgotPasswordModalService]
})
export class ForgotPasswordModal implements OnInit {

    public forgotPasswordForm: FormGroup;
    public errors: any;

    private username: AbstractControl;
    private loading: any;

    constructor(
        private formBuilder: FormBuilder,
        private alertController: AlertController,
        private loadingController: LoadingController,
        private viewController: ViewController,
        private forgotPasswordModalService: ForgotPasswordModalService) {
        this.getDefaults();
    }

    private getDefaults() {
        this.errors = {
            username: ''
        };
    }

    public ngOnInit() {
        this.createForgotPasswordForm();
    }

    private createForgotPasswordForm() {
        this.forgotPasswordForm = this.formBuilder.group({
            username: ['', [Validators.required, Validators.pattern(REGEX.EMAIL)]]
        });

        this.username = this.forgotPasswordForm.get('username');

        this.username.valueChanges.subscribe(newValue => {
            this.errors.username = this.username.hasError('required') ? 'Username is required.' : this.username.hasError('pattern') ? 'Invalid Username address format' : '';
        });
    }

    private validateForm() {
        this.errors.username = this.username.hasError('required') ? 'Username is required.' : this.username.hasError('pattern') ? 'Invalid Username address format' : '';
    }

    public save() {
        this.validateForm();

        if (this.forgotPasswordForm.valid) {
            this.showLoading();
            this.forgotPasswordModalService.resetPassword(this.username.value).subscribe(response => {
                if (response && response.status) {
                    this.alertController.create({
                        message: `Reset Password Successful! New password sent to ${this.username.value}`,
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