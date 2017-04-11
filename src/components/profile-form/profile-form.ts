import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileFormService } from './profile-form.service';
import { ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/concat';

import { LOVS } from '../../constants/constants';
import { REGEX } from '../../config/config';


import { ContactModal } from '../contact-modal/contact-modal.component';

class Contacts{
    private contacts : any[] = [];
    private contactsSubject : BehaviorSubject<any[]> = new BehaviorSubject(this.contacts);

    public set value( contacts : any[]){
        this.contacts = contacts;
        this.contactsSubject.next(this.contacts);
    }

    public get value() : any[]{
        return this.contacts;
    }

    public push(item){
        this.contacts.push(item);
        this.contactsSubject.next(this.contacts);
    }

    public pop(){
        this.contacts.pop();
        this.contactsSubject.next(this.contacts);
    }

    public splice(idx,count,replacement?){
        replacement ?  this.contacts.splice(idx,count,replacement) : this.contacts.splice(idx,count);
        this.contactsSubject.next(this.contacts);
    }

    public subscribe( fn ) : any{
        this.contactsSubject.subscribe(fn);
    }

}

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

    public medicalArts: any;
    public errors: any;
    public gender: string;
    public genderList: any;
    private contactType: any[] = LOVS.CONTACT_TYPE;
    private contacts : Contacts = new Contacts();

    constructor(private formBuilder: FormBuilder,
        private service: ProfileFormService,
        private modal: ModalController) {
        this.getDefaults();
    }

    public ngOnInit() {
        //check for exisiting data
        this.profile = {};
        if (this.usage === 'profile') {
            this.createProfileForm();
            if (this.formType === 'doctor') {
                this.service.getDoctorDetails().subscribe(response => {
                    if (response && response.status) {
                        this.profile = response.result;
                    }
                });
            }else{
                this.profile = {};
            }
        }
        else {
            this.createAccountForm();
            if (this.formType === 'doctor') {
                this.service.getDoctorDetails().subscribe(response => {
                    if (response && response.status) {
                        this.profile = response.result;
                    }
                });
            }else{
                this.service.getAssistantDetails().subscribe(response => {
                    if (response && response.status) {
                        this.profile = response.result;
                    }
                });
            }

            this.gender = this.genderList.filter((g: any) => {
                return g.id == this.profile.gender;
            })[0];
        }



    }

    private getDefaults() {

        // this.formType = 'nonDoctor';
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
            gender: ''
        };
        this.medicalArts = LOVS.MEDICAL_ARTS;
        this.genderList = LOVS.GENDER;
      
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

        const prc = this.profileForm.get('prc');
        const ptr = this.profileForm.get('ptr');
        const medicalArt = this.profileForm.get('medicalArt');
        const specialization = this.profileForm.get('specialization');
        const email = this.profileForm.get('email');
        const lastName = this.profileForm.get('lastName');
        const firstName = this.profileForm.get('firstName');
        const birthDate = this.profileForm.get('birthDate');
        const gender = this.profileForm.get('gender');

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

        //subcription for contacts
        this.contacts.subscribe(newValue => {
            this.errors.contactNo = newValue.length ? '' : "Contact is required";
        })

       
    }

    private createAccountForm() {
        this.profileForm = this.formBuilder.group({
            prc: this.profile.prc,
            ptr: this.profile.ptr,
            medicalArt: this.profile.medicalArt,
            specialization: this.profile.specialization,
            email: [this.profile.email, [Validators.required, Validators.pattern(REGEX.EMAIL)]],
            lastName: this.profile.lastName,
            firstName: this.profile.firstName,
            middleName: this.profile.middleName,
            birthDate: this.profile.birthDate,
            gender: this.profile.gender,
            address: this.profile.address,
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

    public submitForm(event) {
        if(this.profileForm.valid && this.hasContact()){
            this.bindProfileDetails();
            let observable;
            //store details
            if (this.formType === 'doctor') {
                observable = this.service.setDoctorDetails(this.profile)
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

    public addContact(event: Event): void{
        event.preventDefault();
        let modal = this.modal.create(ContactModal, 
        {
            header: "Add User Contact"
        });
        modal.onDidDismiss(_return =>{
            if(_return){
                this.contacts.push(_return);
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
        this.contacts.splice(idx,1);
        this.service.deleteContacts(item.id).subscribe(response => {}
            ,err => {
                this.contacts.splice(idx,0,item);
            });
    }

    public hasContact(){
       
        return !Boolean(this.errors.contactNo);
    }

}