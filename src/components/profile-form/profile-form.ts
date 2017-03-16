import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { config } from '../../config/config';

import { Profile } from '../../shared/model/registration.model';

@Component({
    selector: 'profile-form',
    templateUrl: 'profile-form.html'
})
export class ProfileForm implements OnInit {

    @Input() formType: string;
    @Input() usage: string;

    @Input() profile: Profile;
    @Input() mode: string;

    @Output() onSubmit = new EventEmitter();

    private profileForm: FormGroup;

    public medicalArts: any;
    public errors: any;
    public gender: string;
    public genderList: any;

    constructor(private formBuilder: FormBuilder) {
        this.formType = 'nonDoctor';
        this.usage = 'profile'
        this.errors = {
            prc: '',
            ptr: '',
            medicalArt: '',
            specialization: '',
            email: '',
            lastName: '',
            firstName: '',
            birthDate: '',
            gender: '',
            contactNo: ''
        };
        this.medicalArts = config.medicalArts;
        this.genderList = config.gender;
        this.profile = new Profile();
        this.mode = 'Edit';
    }

    ngOnInit() {
        if (this.usage === 'profile') {
            this.createProfileForm();
        }
        else {
            this.createAccountForm();
        }

        this.gender = this.genderList.filter((g: any) => {
            return g.id == this.profile.gender;
        })[0];

    }

    createProfileForm() {
        this.profileForm = this.formBuilder.group({
            prc: this.formType === 'doctor' ? [this.profile.prc, Validators.required] : [this.profile.prc],
            ptr: this.formType === 'doctor' ? [this.profile.ptr, Validators.required] : [this.profile.ptr],
            medicalArt: this.formType === 'doctor' ? [this.profile.medicalArt, Validators.required] : [this.profile.medicalArt],
            specialization: this.formType === 'doctor' ? [this.profile.specialization, Validators.required] : [this.profile.specialization],
            email: [this.profile.email, [Validators.required, Validators.pattern(config.regex.email)]],
            lastName: [this.profile.lastName, Validators.required],
            firstName: [this.profile.firstName, Validators.required],
            middleName: this.profile.middleName,
            birthDate: [this.profile.birthDate, Validators.required],
            gender: [this.profile.gender, Validators.required],
            address: this.profile.address,
            contactNo: [this.profile.contactNo, Validators.required]
        });

        const prc = this.profileForm.get('prc');
        const ptr = this.profileForm.get('ptr');
        const medicalArt = this.profileForm.get('medicalArt');
        const specialization = this.profileForm.get('specialization');
        const email = this.profileForm.get('email');
        const lastName = this.profileForm.get('lastName');
        const firstName = this.profileForm.get('firstName');
        const birthDate = this.profileForm.get('birthDate');
        const gender = this.profileForm.get('gender');
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

        medicalArt.valueChanges.subscribe(
            newValue => {
                if (medicalArt.hasError('required')) {
                    this.errors.medicalArt = 'Medical Arts is required';
                } else {
                    this.errors.medicalArt = '';
                }
            }
        );

        specialization.valueChanges.subscribe(
            newValue => {
                if (specialization.hasError('required')) {
                    this.errors.specialization = 'Specialization is required';
                } else {
                    this.errors.specialization = '';
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
                if (birthDate.hasError('required')) {
                    this.errors.birthDate = 'Birth Date is required';
                } else {
                    this.errors.birthDate = '';
                }
            }
        );

        gender.valueChanges.subscribe(
            newValue => {
                if (gender.hasError('required')) {
                    this.errors.gender = 'Gender is required';
                } else {
                    this.errors.gender = '';
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

    createAccountForm() {
        this.profileForm = this.formBuilder.group({
            prc: this.profile.prc,
            ptr: this.profile.ptr,
            medicalArt: this.profile.medicalArt,
            specialization: this.profile.specialization,
            email: [this.profile.email, [Validators.required, Validators.pattern(config.regex.email)]],
            lastName:this.profile.lastName,
            firstName: this.profile.firstName,
            middleName: this.profile.middleName,
            birthDate: this.profile.birthDate,
            gender: this.profile.gender,
            address: this.profile.address,
            contactNo: this.profile.contactNo,
        });

        const email = this.profileForm.get('email');

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
    }

    submitForm() {
        this.bindProfileDetails();
        this.onSubmit.emit(this.profile);
    }

    bindProfileDetails() {
        this.profile.prc = this.profileForm.get('prc').value;
        this.profile.ptr = this.profileForm.get('ptr').value;
        this.profile.medicalArt = this.profileForm.get('medicalArt').value;
        this.profile.specialization = this.profileForm.get('specialization').value;
        this.profile.email = this.profileForm.get('email').value;
        this.profile.lastName = this.profileForm.get('lastName').value;
        this.profile.firstName = this.profileForm.get('firstName').value;
        this.profile.middleName = this.profileForm.get('middleName').value;
        this.profile.birthDate = this.profileForm.get('birthDate').value;
        this.profile.gender = this.profileForm.get('gender').value;
        this.profile.address = this.profileForm.get('address').value;
        this.profile.contactNo = this.profileForm.get('contactNo').value;
    }

    isEditMode(): boolean {
        return this.mode !== 'View';
    }
}