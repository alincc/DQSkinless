import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileFormService } from './profile-form.service';
import { ModalController } from 'ionic-angular';

import { LOVS } from '../../constants/constants';
import { REGEX, YEAR_RANGE } from '../../config/config';


import { ContactModal } from '../contact-modal/contact-modal.component';
import { ArraySubject } from '../../shared/model/model';

import { StackedServices } from '../../utilities/utilities';

@Component({
    selector: 'profile-form',
    templateUrl: 'profile-form.html',
    providers: [ProfileFormService]
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
    private stack: StackedServices;

    public errors: any;

    constructor(private formBuilder: FormBuilder,
        private service: ProfileFormService,
        private modal: ModalController) {
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
        this.stack = new StackedServices([]);
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
        this.days = [];
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

        this.prc.valueChanges.subscribe(newValue => {
            this.errors.prc = this.prc.hasError('required') ? 'PRC is required' : '';
        });

        this.medicalArt.valueChanges.subscribe(newValue => {
            this.errors.medicalArt = this.medicalArt.hasError('required') ? 'Medical Arts is required' : '';
        });

        this.specialization.valueChanges.subscribe(newValue => {
            this.errors.specialization = this.specialization.hasError('required') ? 'Specialization is required' : '';
        });

        this.email.valueChanges.subscribe(newValue => {
            this.errors.email = this.email.hasError('required') ? 'Email is required.' : this.email.hasError('pattern') ? 'Invalid email address format' : '';
        });

        this.lastName.valueChanges.subscribe(newValue => {
            this.errors.lastName = this.lastName.hasError('required') ? 'Last Name is required' : '';
        });

        this.firstName.valueChanges.subscribe(newValue => {
            this.errors.firstName = this.firstName.hasError('required') ? 'First Name is required' : '';
        });

        this.year.valueChanges.subscribe(newValue => {
            this.errors.year = this.year.hasError('required') ? 'Birth Year is required' : '';
        });

        this.month.valueChanges.subscribe(newValue => {
            this.errors.month = this.month.hasError('required') ? 'Birth Month is required' : '';
        });

        this.day.valueChanges.subscribe(newValue => {
            this.errors.day = this.day.hasError('required') ? 'Birth Day is required' : '';
        });

        this.gender.valueChanges.subscribe(newValue => {
            this.errors.gender = this.gender.hasError('required') ? 'Gender is required' : '';
        });
    }

    public isEditMode(): boolean {
        return this.mode !== 'View';
    }

    public changeYear() {
        this.clearMonthLOV();
        this.clearDayLOV();
    }

    public changeMonth() {
        this.clearDayLOV();
        this.createDaysLov(this.getLastDayOfTheMonth(this.year.value, this.month.value));
    }

    private clearMonthLOV() {
        this.month.setValue('');
        this.month.markAsPristine();
    }

    private clearDayLOV() {
        this.day.setValue('');
        this.day.markAsPristine();
    }

    private getLastDayOfTheMonth(year, month) {
        const fullYear = year ? Number(year) : (new Date()).getFullYear();
        return month ? (new Date(fullYear, Number(month), 0, 23, 59, 59)).getDate() : 31;
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
                this.hasContact();
            }
        });

        modal.present();
    }

    public removeContact(event: Event, item, idx) {
        event.preventDefault();

        this.contacts.splice(idx, 1);
        if (item.id) {
            this.stack.push(this.service.deleteContacts(item.id));
            this.hasContact();
        }

        this.profileForm.get('address').markAsDirty();
    }

    public hasContact() {
        if (this.contacts.value && this.contacts.value.length > 0) {
            this.errors.contactNo = '';
            return true;
        }

        return false;
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

    public submitForm(event) {
        this.markFormAsDirty();
        this.validateForm();

        if (this.profileForm.valid && this.hasContact()) {
            this.bindProfileDetails();

            this.contacts.value.filter(contact => { return !contact.id }).forEach(contact => {
                this.stack.push(this.service.addContacts(contact));
            });

            if (this.formType === 'D') {
                this.stack.push(this.service.setDoctorDetails(this.profile));
            } else {
                this.stack.push(this.service.setAsistantDetails(this.profile));
            }

            this.stack.executeFork().subscribe(response => {

                if (response) {
                    const submit = response[this.stack.lastIndex];

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
}
