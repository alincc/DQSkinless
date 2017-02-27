import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { config } from '../../config/config';

@Component({
    selector: 'profile-form',
    templateUrl: 'profile-form.html'
})
export class ProfileForm {

    @Output() onSubmit = new EventEmitter();

    private profileForm: FormGroup;

    errors: any;
    genderList: any

    constructor(private formBuilder: FormBuilder) {
        this.createForm();

        this.errors = {
            prc: '',
            ptr: '',
            email: '',
            lastName: '',
            firstName: '',
            middleName: '',
            birthDate: '',
            gender: '',
            address: '',
            contactNo: ''
        };

        this.genderList = config.GENDER;
    }

    createForm() {
        this.profileForm = this.formBuilder.group({
            prc: ['', Validators.required],
            ptr: ['', Validators.required],
            email: ['', [Validators.required, Validators.pattern(config.regex.email)]],
            lastName: ['', Validators.required],
            firstName: ['', Validators.required],
            middleName: [''],
            birthDate: ['', Validators.required],
            gender: [''],
            address: [''],
            contactNo: ['', Validators.required]
        });

        const prc = this.profileForm.get('prc');
        const ptr = this.profileForm.get('ptr');
        const email = this.profileForm.get('email');
        const lastName = this.profileForm.get('lastName');
        const firstName = this.profileForm.get('firstName');
        const birthDate = this.profileForm.get('birthDate');
        const contactNo = this.profileForm.get('contactNo');

        prc.valueChanges.subscribe(
            newValue => {
                if (prc.hasError('required')) {
                    this.errors.prc = 'PRC is required';
                } else {
                    this.errors.prc = '';
                }
            }
        );

        ptr.valueChanges.subscribe(
            newValue => {
                if (ptr.hasError('required')) {
                    this.errors.ptr = 'PTR is required';
                } else {
                    this.errors.ptr = '';
                }
            }
        );

        email.valueChanges.subscribe(
            newValue => {
                if (email.hasError('required')) {
                    this.errors.email = 'Email is required.';
                } else if (email.hasError('pattern')) {
                    this.errors.email = 'Invalid email address format';
                } else {
                    this.errors.email = '';
                }
            }
        );

        lastName.valueChanges.subscribe(
            newValue => {
                if (lastName.hasError('required')) {
                    this.errors.lastName = 'Last Name is required';
                } else {
                    this.errors.lastName = '';
                }
            }
        );

        firstName.valueChanges.subscribe(
            newValue => {
                if (firstName.hasError('required')) {
                    this.errors.firstName = 'First Name is required';
                } else {
                    this.errors.firstName = '';
                }
            }
        );

        birthDate.valueChanges.subscribe(
            newValue => {
                console.log('errors =>' + JSON.stringify(birthDate.errors));
                if (birthDate.hasError('required')) {
                    this.errors.birthDate = 'Birth Date is required';
                } else {
                    this.errors.birthDate = '';
                }
            }
        );

        contactNo.valueChanges.subscribe(
            newValue => {
                if (contactNo.hasError('required')) {
                    this.errors.contactNo = 'Contact No. is required';
                } else {
                    this.errors.contactNo = '';
                }
            }
        );
    }

    submitForm() {
        this.onSubmit.emit(this.profileForm.value);
    }
}