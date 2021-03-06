import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ChangePasswordService } from './change-password-form.service';
import { REGEX } from '../../config/config';

@Component({
    selector: 'change-password-form',
    templateUrl: 'change-password-form.html',
    providers: [ChangePasswordService]
})
export class ChangePasswordForm implements OnInit {

    @Output() public onSubmit = new EventEmitter();

    private oldPassword: AbstractControl;
    private password: AbstractControl;
    private confirm: AbstractControl;
    private changePasswordForm: FormGroup;


    private errors: any;

    constructor(private formBuilder: FormBuilder,
        private service: ChangePasswordService) {
        this.getDefaults();
    }

    public ngOnInit() {
        this.createForm();
    }

    private getDefaults() {

        this.errors = {
            oldPassword: '',
            password: '',
            confirm: ''
        };
    }

    private createForm() {
        this.changePasswordForm = this.formBuilder.group({
            oldPassword: '',
            password: '',
            confirm: ''
        });

        this.oldPassword = this.changePasswordForm.get('oldPassword');
        this.password = this.changePasswordForm.get('password');
        this.confirm = this.changePasswordForm.get('confirm');

        this.oldPassword.valueChanges.subscribe(newValue => {
            this.errors.oldPassword = '';
        });

        this.password.valueChanges.subscribe(newValue => {
            this.errors.password = '';
        });

        this.confirm.valueChanges.subscribe(newValue => {
            this.errors.confirm = '';
        });
    }

    private validateForm() {
        const oldPassword = this.oldPassword.value;
        const password = this.password.value;
        const confirm = this.confirm.value;

        if (oldPassword === '') {
            this.oldPassword.setErrors({ required: true });
            this.errors.oldPassword = 'Old Password is required';
        } else {
            this.oldPassword.setErrors(null);
            this.errors.oldPassword = '';
        }

        if (password === '') {
            this.password.setErrors({ required: true });
            this.errors.password = 'Password is required';
        } else if (!REGEX.PASSWORD.test(password)) {
            this.password.setErrors({ pattern: true });
            this.errors.password = 'Password must be alphanumeric and at least 8 characters long';
        } else {
            this.password.setErrors(null);
            this.errors.password = '';
        }

        if (confirm !== password) {
            this.password.setErrors({ notMatch: true });
            this.confirm.setErrors({ notMatch: true });
            this.errors.confirm = 'Passwords do not match';
        } else {
            this.confirm.setErrors(null);
            this.errors.confirm = '';
        }
    }

    private markFormAsDirty() {
        Object.keys(this.changePasswordForm.controls).forEach(key => {
            this.changePasswordForm.get(key).markAsDirty();
        });
    }

    public submitForm(event) {
        this.markFormAsDirty();
        this.validateForm();
        if (this.changePasswordForm.valid) {
            this.service.changePassword(this.changePasswordForm.value).subscribe(response => {
                if (response.status) {
                    this.onSubmit.emit(this.changePasswordForm.value);
                }
                event.dismissLoading();
            }, err => event.dismissLoading());
        } else {
            event.dismissLoading();
        }
    }
}