import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileFormService } from './profile-form.service';
import { ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/concat';

import { LOVS } from '../../constants/constants';
import { REGEX } from '../../config/config';


import { ContactModal } from '../contact-modal/contact-modal.component';
import { ArraySubject } from '../../shared/model/model'


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

    public medicalArts: any[];
    public errors: any;
    public genderList: any[];
    private contactType: any[] = LOVS.CONTACT_TYPE;
    private contacts : ArraySubject = new ArraySubject();
    private prc: AbstractControl;
    private ptr: AbstractControl;
    private medicalArt: AbstractControl;
    private specialization: AbstractControl;
    private email: AbstractControl;
    private lastName: AbstractControl;
    private firstName: AbstractControl;
    private birthDate: AbstractControl;
    private gender: AbstractControl;

    constructor(private formBuilder: FormBuilder,
        private service: ProfileFormService,
        private modal: ModalController) {
        this.getDefaults();
    }

    public ngOnInit() {
        this.profile = {};
        this.createProfileForm();
        if (this.formType === 'doctor') {
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
    }

    private getDefaults() {
        this.formType = 'nonDoctor';
        this.errors = {
            prc: '',
            ptr: '',
            medicalArt: '',
            specialization: '',
            email: '',
            lastName: '',
            firstName: '',
            birthDate: '',
            gender: ''
        };
        this.medicalArts = LOVS.MEDICAL_ARTS;
        this.genderList = LOVS.GENDER;
        this.contactType = LOVS.CONTACT_TYPE;

        this.mode = 'Edit';
    }

    private createProfileForm() {
        this.profileForm = this.formBuilder.group({
            prc: this.formType === 'doctor' ? [this.profile.prc, Validators.required] : [this.profile.prc],
            ptr: this.formType === 'doctor' ? [this.profile.ptr, Validators.required] : [this.profile.ptr],
            medicalArt: this.formType === 'doctor' ? [this.profile.medicalArt, Validators.required] : [this.profile.medicalArt],
            specialization: this.formType === 'doctor' ? [this.profile.specialization, Validators.required] : [this.profile.specialization],
            email: [this.profile.email, [Validators.required, Validators.pattern(REGEX.EMAIL)]],
            lastName: [this.profile.lastName, Validators.required],
            firstName: [this.profile.firstName, Validators.required],
            middleName: this.profile.middleName,
            birthDate: [this.profile.birthDate, Validators.required],
            gender: [this.profile.gender, Validators.required],
            address: this.profile.address
        });

        this.prc = this.profileForm.get('prc');
        this.ptr = this.profileForm.get('ptr');
        this.medicalArt = this.profileForm.get('medicalArt');
        this.specialization = this.profileForm.get('specialization');
        this.email = this.profileForm.get('email');
        this.lastName = this.profileForm.get('lastName');
        this.firstName = this.profileForm.get('firstName');
        this.birthDate = this.profileForm.get('birthDate');
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

        this.ptr.valueChanges.subscribe(
            newValue => {
                if (this.ptr.hasError('required')) {
                    this.errors.ptr = 'PTR is required';
                } else {
                    this.errors.ptr = '';
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

        this.birthDate.valueChanges.subscribe(
            newValue => {
                if (this.birthDate.hasError('required')) {
                    this.errors.birthDate = 'Birth Date is required';
                } else {
                    this.errors.birthDate = '';
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

        //subcription for contacts
        this.contacts.subscribe(newValue => {
            if(newValue)
                this.errors.contactNo = newValue.length ? '' : "Contact is required";
        })


    }

    public submitForm(event) {
        this.markFormAsDirty();
        this.validateForm();
        if (this.profileForm.valid && this.hasContact()) {
            this.bindProfileDetails();
            let observable;
            //store details
            if (this.formType === 'doctor') {
                observable = this.service.setDoctorDetails(this.profile);
            } else {
                observable = this.service.addAsistantDetails(this.profile);
            }
            observable.subscribe(response => {
                    if (response.status) {
                        this.onSubmit.emit(this.profile);
                    }
                    event.dismissLoading();
                })
        }else{
            event.dismissLoading();
        }
    }

    private markFormAsDirty() {
        Object.keys(this.profileForm.controls).forEach(key => {
            this.profileForm.get(key).markAsDirty();
        });
    }

    private validateForm() {
        if (this.prc.hasError('required')) {
            this.errors.prc = 'PRC is required';
        } else {
            this.errors.prc = '';
        }

        if (this.ptr.hasError('required')) {
            this.errors.ptr = 'PTR is required';
        } else {
            this.errors.ptr = '';
        }

        if (this.medicalArt.hasError('required')) {
            this.errors.medicalArt = 'Medical Arts is required';
        } else {
            this.errors.medicalArt = '';
        }

        if (this.specialization.hasError('required')) {
            this.errors.specialization = 'Specialization is required';
        } else {
            this.errors.specialization = '';
        }

        if (this.email.hasError('required')) {
            this.errors.email = 'Email is required.';
        } else if (this.email.hasError('pattern')) {
            this.errors.email = 'Invalid email address format';
        } else {
            this.errors.email = '';
        }

        if (this.lastName.hasError('required')) {
            this.errors.lastName = 'Last Name is required';
        } else {
            this.errors.lastName = '';
        }

        if (this.firstName.hasError('required')) {
            this.errors.firstName = 'First Name is required';
        } else {
            this.errors.firstName = '';
        }

        if (this.birthDate.hasError('required')) {
            this.errors.birthDate = 'Birth Date is required';
        } else {
            this.errors.birthDate = '';
        }

        if (this.gender.hasError('required')) {
            this.errors.gender = 'Gender is required';
        } else {
            this.errors.gender = '';
        }

        this.hasContact();
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
        this.profile.birthdate = this.profileForm.get('birthDate').value;
        this.profile.gender = this.profileForm.get('gender').value;
        this.profile.address = this.profileForm.get('address').value;
    }

    public isEditMode(): boolean {
        return this.mode !== 'View';
    }

    public addContact(event: Event): void {
        event.preventDefault();
        let modal = this.modal.create(ContactModal,
            {
                header: "Add User Contact"
            });
        modal.onDidDismiss(_return => {
            if (_return) {
                if(this.contacts.value){
                    this.contacts.push(_return);
                }
                else{
                    this.contacts.value = [_return];
                }
                // this.hasContact();
                this.service.addContacts(_return).subscribe(response => {
                        if(response.status){
                            _return.id = response.result;
                        }
                    },err => {
                       this.contacts.pop();
                   });
            }
        });
        modal.present();
    }

    public removeContact(event,item,idx){
        event.preventDefault();
        this.contacts.splice(idx, 1);
        this.service.deleteContacts(item.id).subscribe(response => {}
            ,err => {
                this.contacts.splice(idx,0,item);
            });
    }

    public hasContact() {

        return !Boolean(this.errors.contactNo);
    }
}
