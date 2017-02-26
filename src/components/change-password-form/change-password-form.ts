import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { equalValidator } from '../../shared/equal-validation.directive';

@Component({
    selector: 'change-password-form',
    templateUrl: 'change-password-form.html',
})
export class ChangePasswordForm implements OnInit {

    @Output() onSubmit = new EventEmitter();

    private changePasswordForm: FormGroup;

    errors: any;
    password: AbstractControl;
    confirm: AbstractControl;

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
            password: ['', Validators.required],
            confirm: ['', [Validators.required, equalValidator('password', false)]]
        });

        this.password = this.changePasswordForm.get('password');
        this.confirm = this.changePasswordForm.get('confirm');

        this.password.valueChanges.subscribe(
            newValue => {
                if (this.password.hasError('required')) {
                    this.errors.password = 'Password is required.';
                } else {
                    this.errors.password = '';
                }
            }
        );

        this.confirm.valueChanges.subscribe(
            newValue => {
                if (this.confirm.hasError('required')) {
                    this.errors.confirm = 'Password is required.';
                } else if (!this.confirm.hasError('match')) {
                    this.errors.confirm = 'Passwords do not match.';
                } else {
                    this.errors.confirm = '';
                }
            }
        );
    }

    submitForm() {
        this.onSubmit.emit(this.changePasswordForm.get('password').value);
    }
}