import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ViewController } from 'ionic-angular';

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

    constructor(
        private formBuilder: FormBuilder,
        private alertController: AlertController,
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

        this.email.valueChanges.subscribe(
            newValue => {
                if (this.email.hasError('required')) {
                    this.errors.email = 'Email is required.';
                } else if (this.email.hasError('pattern')) {
                    this.errors.email = 'Invalid email address format';
                } else {
                    this.errors.email = '';
                }
            }
        );
    }

    private markFormAsDirty() {
        Object.keys(this.assistantForm.controls).forEach(key => {
            this.assistantForm.get(key).markAsDirty();
        });
    }

    private validateForm() {
        if (this.email.hasError('required')) {
            this.errors.email = 'Email is required.';
        } else if (this.email.hasError('pattern')) {
            this.errors.email = 'Invalid email address format';
        } else {
            this.errors.email = '';
        }
    }

    public save() {
        this.markFormAsDirty();
        this.validateForm();

        if (this.assistantForm.valid) {
            this.accountCreationModalService.createAccount(this.email.value).subscribe(response => {
                if (response && response.status) {

                    const assistantAccount = {
                        userId: response.result.userId,
                        username: response.result.username,
                        password: response.result.password,
                    }

                    this.alertController.create({
                        message: `Account created! Pre-generated password sent to ${this.email.value}`,
                        buttons: [
                            {
                                text: 'OK',
                                handler: () => {
                                    this.viewController.dismiss(assistantAccount).catch(() => { });
                                }
                            }
                        ]
                    }).present();
                }
            });
        }
    }
}