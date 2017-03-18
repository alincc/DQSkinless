import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { REGEX } from '../../config/config';

import { equalValidator } from '../../shared/directive/equal-validation.directive';

@Component({
    selector: 'change-password-form',
    templateUrl: 'change-password-form.html',
})
export class ChangePasswordForm implements OnInit {

    @Output() onSubmit = new EventEmitter();

    private changePasswordForm: FormGroup;

    errors: any;

    constructor(private formBuilder: FormBuilder) {
        this.errors = {
            password: '',
            confirm: ''
        };
    }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.changePasswordForm = this.formBuilder.group({
            password: ['', [Validators.required, Validators.pattern(REGEX.PASSWORD)]],
            confirm: ['', [Validators.required, Validators.pattern(REGEX.PASSWORD), equalValidator('password', false)]]
        });

        const password = this.changePasswordForm.get('password');
        const confirm = this.changePasswordForm.get('confirm');

        password.valueChanges.subscribe(
            newValue => {
                if (password.hasError('required')) {
                    this.errors.password = 'Password is required';
                } else if (password.hasError('pattern')) {
                    this.errors.password = 'Password must be alphanumeric and at least 8 characters long';
                } else {
                    this.errors.password = '';
                }
            }
        );

        confirm.valueChanges.subscribe(
            newValue => {
                if (confirm.hasError('required')) {
                    this.errors.confirm = 'Password is required';
                } else if (confirm.hasError('pattern')) {
                    this.errors.confirm = 'Password must be alphanumeric and at least 8 characters long';
                } else if (!confirm.hasError('match')) {
                    this.errors.confirm = 'Passwords do not match';
                } else {
                    this.errors.confirm = '';
                }
            }
        );
    }

    submitForm() {
        this.onSubmit.emit(btoa(this.changePasswordForm.get('password').value));
    }
}