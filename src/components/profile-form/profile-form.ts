import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileFormService } from './profile-form.service';
import { ModalController } from 'ionic-angular';

import { LOVS } from '../../constants/constants';
import { REGEX, YEAR_RANGE } from '../../config/config';


import { ContactModal } from '../contact-modal/contact-modal.component';
import { ArraySubject } from '../../shared/model/model';

import { StackedServices } from '../../services/services';

@Component({
    selector: 'profile-form',
    templateUrl: 'profile-form.html',
    providers: [ProfileFormService, StackedServices]
})
export class ProfileForm implements OnInit {

    @Input() formType: string;
    @Input() usage: string;

    @Input() profile: any;
    @Input() mode: string;

    @Output() onSubmit = new EventEmitter();


    private profileForm: FormGroup;

    public contactType: any[];
    public days: any[];
    public genderList: any[];
    public medicalArts: any[];
    public months: any[];
    public years: any[];

    public errors: any;

    private contacts: ArraySubject = new ArraySubject();
    private today = new Date();
    private prc: AbstractControl;
    private medicalArt: AbstractControl;
    private specialization: AbstractControl;
    private email: AbstractControl;
    private lastName: AbstractControl;
    private firstName: AbstractControl;
    private year: AbstractControl;
    private month: AbstractControl;
    private day: AbstractControl;
    private gender: AbstractControl;

    constructor(private formBuilder: FormBuilder,
        private service: ProfileFormService,
        private modal: ModalController,
        private stackedServices: StackedServices) {
        this.getDefaults();
    }

    public ngOnInit() {
        this.profile = {};
        if (this.formType === 'D') {
            this.service.getDoctorDetails().subscribe(response => {
                if (response && response.status) {
                    this.profile = response.result;
                }
            });
        } else {
            this.service.getAssistantDetails().subscribe(response => {
                if (response && response.status) {
                    this.profile = response.result;
                }
            });
        }
        this.createProfileForm();
    }

    private getDefaults() {
        this.formType = 'ND';
        this.errors = {
            prc: '',
            ptr: '',
            medicalArt: '',
            specialization: '',
            email: '',
            lastName: '',
            firstName: '',
            year: '',
            month: '',
            day: '',
            gender: ''
        };

        this.contactType = LOVS.CONTACT_TYPE;
        this.years = [];
        this.months = [];
        this.days = [];
        this.genderList = LOVS.GENDER;
        this.medicalArts = LOVS.MEDICAL_ARTS;
        this.createDateLov();

        this.contacts = new ArraySubject([]);
        this.mode = 'Edit';
    }

    private createDateLov() {
        let minYear = this.today.getFullYear() - 100;

        for (let i = 0; i <= YEAR_RANGE; i++) {
            this.years.push(minYear.toString());
            minYear++;
        }

        for (let i = 1; i <= 12; i++) {
            this.months.push(this.leftPad(i.toString(), '0', 2));
        }

        this.createDaysLov(31);
    }

    private leftPad(num, pad, size) {
        let s = num + '';
        while (s.length < size) s = pad + s;
        return s;
    }

    private createDaysLov(maxDay) {
        for (let i = 1; i <= maxDay; i++) {
            this.days.push(this.leftPad(i.toString(), '0', 2));
        }
    }

    private createProfileForm() {
        this.profileForm = this.formBuilder.group({
            prc: this.formType === 'D' ? [this.profile.prc, Validators.required] : [this.profile.prc],
            ptr: this.profile.ptr,
            medicalArt: this.formType === 'D' ? [this.profile.medicalArt, Validators.required] : [this.profile.medicalArt],
            specialization: this.formType === 'D' ? [this.profile.specialization, Validators.required] : [this.profile.specialization],
            email: [this.profile.email, [Validators.required, Validators.pattern(REGEX.EMAIL)]],
            lastName: [this.profile.lastName, Validators.required],
            firstName: [this.profile.firstName, Validators.required],
            middleName: this.profile.middleName,
            year: [this.profile.birthdate ? (new Date(this.profile.birthdate)).getFullYear() : '', Validators.required],
            month: [this.profile.birthdate ? (new Date(this.profile.birthdate)).getMonth() : '', Validators.required],
            day: [this.profile.birthdate ? (new Date(this.profile.birthdate)).getDay() : '', Validators.required],
            gender: [this.profile.gender, Validators.required],
            address: this.profile.address
        });

        this.prc = this.profileForm.get('prc');
        this.medicalArt = this.profileForm.get('medicalArt');
        this.specialization = this.profileForm.get('specialization');
        this.email = this.profileForm.get('email');
        this.lastName = this.profileForm.get('lastName');
        this.firstName = this.profileForm.get('firstName');
        this.year = this.profileForm.get('year');
        this.month = this.profileForm.get('month');
        this.day = this.profileForm.get('day');
        this.gender = this.profileForm.get('gender');

        this.prc.valueChanges.subscribe(
            newValue => {
                if (this.prc.hasError('required')) {
                    this.errors.prc = 'PRC is required';
                } else {
                    this.errors.prc = '';
                }
            }
        );

        this.medicalArt.valueChanges.subscribe(
            newValue => {
                if (this.medicalArt.hasError('required')) {
                    this.errors.medicalArt = 'Medical Arts is required';
                } else {
                    this.errors.medicalArt = '';
                }
            }
        );

        this.specialization.valueChanges.subscribe(
            newValue => {
                if (this.specialization.hasError('required')) {
                    this.errors.specialization = 'Specialization is required';
                } else {
                    this.errors.specialization = '';
                }
            }
        );

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

        this.lastName.valueChanges.subscribe(
            newValue => {
                if (this.lastName.hasError('required')) {
                    this.errors.lastName = 'Last Name is required';
                } else {
                    this.errors.lastName = '';
                }
            }
        );

        this.firstName.valueChanges.subscribe(
            newValue => {
                if (this.firstName.hasError('required')) {
                    this.errors.firstName = 'First Name is required';
                } else {
                    this.errors.firstName = '';
                }
            }
        );

        this.year.valueChanges.subscribe(
            newValue => {
                if (this.year.hasError('required')) {
                    this.errors.year = 'Birth Year is required';
                } else {
                    this.errors.year = '';
                }
            }
        );

        this.month.valueChanges.subscribe(
            newValue => {
                if (this.month.hasError('required')) {
                    this.errors.month = 'Birth Month is required';
                } else {
                    this.errors.month = '';
                }
            }
        );

        this.day.valueChanges.subscribe(
            newValue => {
                if (this.day.hasError('required')) {
                    this.errors.day = 'Birth Day is required';
                } else {
                    this.errors.day = '';
                }
            }
        );

        this.gender.valueChanges.subscribe(
            newValue => {
                if (this.gender.hasError('required')) {
                    this.errors.gender = 'Gender is required';
                } else {
                    this.errors.gender = '';
                }
            }
        );
    }

    public addContact(event: Event): void {
        event.preventDefault();

        let modal = this.modal.create(ContactModal,
            {
                header: "Add User Contact"
            });

        modal.onDidDismiss(contact => {
            if (contact) {
                this.contacts.push(contact);
                this.profileForm.get('address').markAsDirty();
            }
        });

        modal.present();
    }

    public removeContact(event: Event, item, idx) {
        event.preventDefault();

        this.contacts.splice(idx, 1);
        if (item.id) {
            this.stackedServices.push(this.service.deleteContacts(item.id));
        }

        this.profileForm.get('address').markAsDirty();
    }

    public hasContact() {
        return this.contacts.value && this.contacts.value.length > 0;
    }

    public submitForm(event) {
        this.markFormAsDirty();
        this.validateForm();

        if (this.profileForm.valid && this.hasContact()) {
            this.bindProfileDetails();

            this.contacts.value.forEach(contact => {
                this.stackedServices.push(this.service.addContacts(contact));
            });

            if (this.formType === 'D') {
                this.stackedServices.push(this.service.setDoctorDetails(this.profile));
            } else {
                this.stackedServices.push(this.service.setAsistantDetails(this.profile));
            }

            this.stackedServices.executeFork().subscribe(response => {

                if (response) {
                    const submit = response[this.stackedServices.lastIndex];

                    if (submit && submit.status) {
                        this.onSubmit.emit(this.profile);
                    }
                }

                event.dismissLoading();
            }, err => event.dismissLoading());
        } else {
            event.dismissLoading();
        }
    }

    private markFormAsDirty() {
        Object.keys(this.profileForm.controls).forEach(key => {
            this.profileForm.get(key).markAsDirty();
        });
    }

    private validateForm() {
        this.errors.prc = this.prc.hasError('required') ? 'PRC is required' : '';
        this.errors.medicalArt = this.medicalArt.hasError('required') ? 'Medical Arts is required' : '';
        this.errors.specialization = this.specialization.hasError('required') ? 'Specialization is required' : '';
        this.errors.email = this.email.hasError('required') ? 'Email is required.' : this.email.hasError('pattern') ? 'Invalid email address format' : '';
        this.errors.lastName = this.lastName.hasError('required') ? 'Last Name is required' : '';
        this.errors.firstName = this.firstName.hasError('required') ? 'First Name is required' : '';
        this.errors.year = this.year.hasError('required') ? 'Birth Year is required' : '';
        this.errors.month = this.month.hasError('required') ? 'Birth Month is required' : '';
        this.errors.day = this.day.hasError('required') ? 'Birth Day is required' : '';
        this.errors.gender = this.gender.hasError('required') ? 'Gender is required' : '';
        this.errors.contactNo = this.hasContact() ? '' : "Contact is required";
    }

    private bindProfileDetails() {
        this.profile.prcNum = this.profileForm.get('prc').value;
        this.profile.ptr = this.profileForm.get('ptr').value;
        this.profile.medicalArt = this.profileForm.get('medicalArt').value;
        this.profile.specialization = this.profileForm.get('specialization').value;
        this.profile.email = this.profileForm.get('email').value;
        this.profile.lastname = this.profileForm.get('lastName').value;
        this.profile.firstname = this.profileForm.get('firstName').value;
        this.profile.middlename = this.profileForm.get('middleName').value;
        this.profile.birthdate = this.profileForm.get('year').value + '-' + this.profileForm.get('month').value + '-' + this.profileForm.get('day').value;
        this.profile.gender = this.profileForm.get('gender').value;
        this.profile.address = this.profileForm.get('address').value;
    }

    public isEditMode(): boolean {
        return this.mode !== 'View';
    }
}
