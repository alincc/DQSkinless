import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'profile-form',
    templateUrl: 'profile-form.html'
})
export class ProfileForm {

    @Output() onSubmit = new EventEmitter();

    private profileForm: FormGroup;

    errors: any;

    constructor(private formBuilder: FormBuilder) {
        this.createForm();

        this.errors = {
            lastName: '',
            firstName: '',
            birthDate: '',
            gender: '',
            address: '',
            contactNo: ''
        };
    }

    createForm() {
        this.profileForm = this.formBuilder.group({
            lastName: ['', Validators.required],
            firstName: ['', Validators.required],
            middleName: [''],
            birthDate: ['', Validators.required],
            gender: ['', Validators.required],
            address: ['', Validators.required],
            contactNo: ['', Validators.required],
        });

        const lastName = this.profileForm.get('lastName');
        const firstName = this.profileForm.get('firstName');
        const birthDate = this.profileForm.get('birthDate');
        const gender = this.profileForm.get('gender');
        const address = this.profileForm.get('address');
        const contactNo = this.profileForm.get('contactNo');

        lastName.valueChanges.subscribe(
            newValue => {
                if (lastName.hasError('required')) {
                    this.errors.lastName = 'Last Name is required.';
                } else {
                    this.errors.lastName = '';
                }
            }
        );

        firstName.valueChanges.subscribe(
            newValue => {
                if (firstName.hasError('required')) {
                    this.errors.firstName = 'First Name is required.';
                } else {
                    this.errors.firstName = '';
                }
            }
        );

        birthDate.valueChanges.subscribe(
            newValue => {
                if (birthDate.hasError('required')) {
                    this.errors.birthDate = 'Birth Date is required.';
                } else {
                    this.errors.birthDate = '';
                }
            }
        );

        gender.valueChanges.subscribe(
            newValue => {
                if (gender.hasError('required')) {
                    this.errors.gender = 'Gender is required.';
                } else {
                    this.errors.gender = '';
                }
            }
        );
        address.valueChanges.subscribe(
            newValue => {
                if (address.hasError('required')) {
                    this.errors.address = 'Address is required.';
                } else {
                    this.errors.address = '';
                }
            }
        );
        contactNo.valueChanges.subscribe(
            newValue => {
                if (contactNo.hasError('required')) {
                    this.errors.contactNo = 'Contact Number is required.';
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