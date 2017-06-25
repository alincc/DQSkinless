import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ModalController } from 'ionic-angular';

import { ProfileFormService } from './profile-form.service';
import { Storage } from '../../services/storage';

import { LOVS } from '../../constants/constants';
import { REGEX, YEAR_RANGE } from '../../config/config';

import { ContactModal } from '../contact-modal/contact-modal.component';
import { ArraySubject } from '../../shared/model/model';

import { Utilities, StackedServices } from '../../utilities/utilities';

@Component({
    selector: 'profile-form',
    templateUrl: 'profile-form.html',
    providers: [ProfileFormService]
})
export class ProfileForm implements OnInit {

    @Input() formType: string;
    @Input() usage: string;

    @Input() profile: any;

    @Output() onSubmit = new EventEmitter();


    public profileForm: FormGroup;
    public contacts: ArraySubject = new ArraySubject();

    public contactType: any[];
    public genderList: any[];
    public medicalArts: any[];
    public errors: any;

    private today = new Date();
    private prc: AbstractControl;
    private ptr: AbstractControl;
    private medicalArt: AbstractControl;
    private specialization: AbstractControl;
    private email: AbstractControl;
    private lastName: AbstractControl;
    private firstName: AbstractControl;
    private middleName: AbstractControl;
    private gender: AbstractControl;
    private birthDate: AbstractControl;
    private address: AbstractControl;
    private stack: StackedServices;

    public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private formBuilder: FormBuilder,
        private modalController: ModalController,
        private service: ProfileFormService,
        private storage: Storage) {
        this.getDefaults();
    }

    public ngOnInit() {
        this.profile = {};
        this.createProfileForm();
        this.isLoading.next(true);
        const getProfileDetails$ = this.formType === 'D' ? this.service.getDoctorDetails() : this.service.getAssistantDetails();
        const getContacts$ = this.service.getUserContacts();

        this.stack.push(getProfileDetails$);
        this.stack.push(getContacts$);
        this.stack.executeFork().subscribe(response => {
            if (response) {
                const getProfileDetails = response[0];
                const getContacts = response[1];

                if (getProfileDetails && getProfileDetails.status) {
                    this.profile = getProfileDetails.result;
                    this.bindProfileFormValues();
                }

                if (getContacts && getContacts.status) {
                    this.contacts.value = getContacts.result;
                }
            }

            this.stack.clearStack();
            this.isLoading.next(false);
        }, err => {
            this.stack.clearStack();
            this.isLoading.next(false);
        });
    }

    private getDefaults() {
        this.formType = 'ND';
        this.errors = {
            prc: '',
            medicalArt: '',
            specialization: '',
            email: '',
            lastName: '',
            firstName: '',
            gender: '',
            birthDate: ''
        };

        this.contactType = LOVS.CONTACT_TYPE;
        this.genderList = LOVS.GENDER;
        this.medicalArts = LOVS.MEDICAL_ARTS;
        this.stack = new StackedServices([]);
    }

    private bindProfileFormValues() {
        this.prc.setValue(this.profile.prcNum);
        this.ptr.setValue(this.profile.ptr);
        this.medicalArt.setValue(this.profile.medicalArt);
        this.specialization.setValue(this.profile.specialization);
        this.email.setValue(this.profile.email);
        this.lastName.setValue(this.profile.lastname);
        this.firstName.setValue(this.profile.firstname);
        this.middleName.setValue(this.profile.middlename);
        this.gender.setValue(this.profile.gender);
        const bday = this.profile.birthdate ? Utilities.getISODate(this.profile.birthdate) : '';
        this.birthDate.setValue(bday);
        this.address.setValue(this.profile.address);
    }

    private createProfileForm() {
        this.profileForm = this.formBuilder.group({
            prc: this.formType === 'D' ? ['', Validators.required] : [''],
            ptr: '',
            medicalArt: this.formType === 'D' ? ['', Validators.required] : [''],
            specialization: this.formType === 'D' ? ['', Validators.required] : [''],
            email: ['', [Validators.required, Validators.pattern(REGEX.EMAIL)]],
            lastName: ['', Validators.required],
            firstName: ['', Validators.required],
            middleName: '',
            gender: ['', Validators.required],
            birthDate: ['', Validators.required],
            address: ''
        });

        this.prc = this.profileForm.get('prc');
        this.ptr = this.profileForm.get('ptr');
        this.medicalArt = this.profileForm.get('medicalArt');
        this.specialization = this.profileForm.get('specialization');
        this.email = this.profileForm.get('email');
        this.lastName = this.profileForm.get('lastName');
        this.firstName = this.profileForm.get('firstName');
        this.middleName = this.profileForm.get('middleName');
        this.gender = this.profileForm.get('gender');
        this.birthDate = this.profileForm.get('birthDate');
        this.address = this.profileForm.get('address');

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

        this.gender.valueChanges.subscribe(newValue => {
            this.errors.gender = this.gender.hasError('required') ? 'Gender is required' : '';
        });

        this.birthDate.valueChanges.subscribe(newValue => {
            this.errors.birthDate = this.birthDate.hasError('required') ? 'Birth Date is required' : '';
        });
    }

    private getLastDayOfTheMonth(year, month) {
        const fullYear = year ? Number(year) : (new Date()).getFullYear();
        return month ? (new Date(fullYear, Number(month), 0, 23, 59, 59)).getDate() : 31;
    }

    public addContact(event: Event): void {
        event.preventDefault();

        let modal = this.modalController.create(ContactModal,
            {
                header: "Add User Contact"
            });

        modal.onDidDismiss(contact => {
            if (contact) {
                this.contacts.push(contact);
                this.address.markAsDirty();
                this.hasContact();
            }
        });

        modal.present();
    }

    public removeContact(event: Event, item, idx) {
        event.preventDefault();

        this.contacts.splice(idx, 1);
        this.hasContact();

        if (item.id) {
            this.stack.push(this.service.deleteContacts(item.id));
        }

        this.address.markAsDirty();
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
        this.errors.gender = this.gender.hasError('required') ? 'Gender is required' : '';
        this.errors.birthDate = this.birthDate.hasError('required') ? 'Birth Date is required' : '';
        this.errors.contactNo = this.hasContact() ? '' : "Contact is required";
    }

    private bindProfileDetails() {
        this.profile.prcNum = this.prc.value;
        this.profile.ptr = this.ptr.value;
        this.profile.medicalArt = this.medicalArt.value;
        this.profile.specialization = this.specialization.value;
        this.profile.email = this.email.value;
        this.profile.lastname = Utilities.formatName(this.lastName.value);
        this.profile.firstname = Utilities.formatName(this.firstName.value);
        this.profile.middlename = Utilities.formatName(this.middleName.value);
        this.profile.gender = this.gender.value;
        this.profile.birthdate = this.birthDate.value;
        this.profile.address = this.address.value;
    }

    private updateUserDetailStorage() {
        if (this.profile.birthdate) {
            const birthdate = new Date(this.profile.birthdate);
            this.profile.birthdate = birthdate.getTime() - (Math.abs(birthdate.getTimezoneOffset() * 60 * 1000));
        }

        this.storage.userDetails = this.profile;
    }

    public submitForm(event) {
        this.markFormAsDirty();
        this.validateForm();

        if (this.profileForm.valid && this.hasContact()) {
            this.bindProfileDetails();

            this.contacts.value.filter(contact => !contact.id).forEach(contact => {
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
                        this.updateUserDetailStorage();
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
