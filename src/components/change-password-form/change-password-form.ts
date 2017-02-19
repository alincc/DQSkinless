import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'change-password-form',
    templateUrl: 'change-password-form.html'
})
export class ChangePasswordForm {

    @Output() onSubmit = new EventEmitter();

    private changePasswordForm: FormGroup;

    errors: any;

    constructor(private formBuilder: FormBuilder) {
        this.createForm();

        this.errors = {
            password: '',
            confirm: ''
        };
    }

    createForm() {
        this.changePasswordForm = this.formBuilder.group({
            password: ['', Validators.required],
            confirm: ['', Validators.required],
        },
            { validator: this.passwordMatcher });

        const password = this.changePasswordForm.get('password');
        const confirm = this.changePasswordForm.get('confirm');

        password.valueChanges.subscribe(
            newValue => {
                if (password.hasError('required')) {
                    this.errors.password = 'Password is required.';
                } else {
                    this.errors.password = '';
                }
            }
        );

        confirm.valueChanges.subscribe(
            newValue => {
                if (confirm.hasError('required')) {
                    this.errors.confirm = 'Password is required.';
                } else {
                    this.errors.confirm = '';
                }
            }
        );
    }

    passwordMatcher = (control: AbstractControl): { [key: string]: boolean } => {
        const password = control.get('password');
        const confirm = control.get('confirm');

        if (!password || !confirm) {
            return null;
        };

        if (password.invalid || confirm.invalid) {
            return null;
        };

        return password.value === confirm.value ? null : { passwordsDoNotMatch: true };
    }

    submitForm() {
        this.onSubmit.emit(this.changePasswordForm.get('password').value);
        console.log(this.changePasswordForm.value);
    }
}