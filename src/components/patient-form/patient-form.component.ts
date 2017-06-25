import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';

import { LOVS, MODE } from '../../constants/constants';
import { REGEX } from '../../config/config';

import { ContactModal } from '../contact-modal/contact-modal.component';
import { ArraySubject } from '../../shared/model/model';

import { PatientFormService } from './patient-form.service';
import { StackedServices, Utilities } from '../../utilities/utilities';
import { RootNavController, Storage } from '../../services';

import { PatientProfilePage } from '../../pages/patient-profile/patient-profile.page';

@Component({
  selector: 'patient-form',
  templateUrl: 'patient-form.html',
  providers: [PatientFormService]
})
export class PatientForm implements OnInit {
  
  @Input() patient: any;
  @Input() patientId: any;

  @Output() onSubmit = new EventEmitter();

  private patientForm: FormGroup;
  public contactType: any[];
  public genderList: any[];
  public legalStatusList: any[];
  public disableSubmit: boolean;
  public mode: string;

  private firstName: AbstractControl;
  private lastName: AbstractControl;
  private middleName: AbstractControl;
  private age: AbstractControl;
  private legalStatus: AbstractControl;
  private gender: AbstractControl;
  private address: AbstractControl;
  private email: AbstractControl;
  private registrationDate: AbstractControl;
  private birthDate: AbstractControl;
  private stack: StackedServices;

  private contacts: ArraySubject = new ArraySubject([]);

  private errors: any;

  constructor(
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private rootNav: RootNavController,
    private params: NavParams,
    private patientService: PatientFormService,
    private storage: Storage) {
    this.getDefaults();
  }

  public ngOnInit() {
    this.patient = {};
    this.mode = this.params.get('mode') ? this.params.get('mode') : MODE.add;
    this.patientId = this.params.get('patientId');
    this.createForm();
    this.contactType = LOVS.CONTACT_TYPE;

    if (this.patientId) {
      this.getPatientDetails();
    }
  }

  private getDefaults() {

    this.errors = {
      firstName: '',
      lastName: '',
      middleName: '',
      confirm: '',
      // age: '',
      legalStatus: '',
      gender: '',
      address: '',
      email: '',
      registrationDate: '',
      birthDate: '',
      contactNo: ''
    };

    this.genderList = LOVS.GENDER;
    this.legalStatusList = LOVS.LEGAL_STATUS;
    this.stack = new StackedServices([]);
    this.disableSubmit = false;
  }

  private createForm() {
    this.patientForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: '',
      age: ['', Validators.required],
      legalStatus: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(REGEX.EMAIL)]],
      registrationDate: [Utilities.getISODateToday(), Validators.required],
      birthDate: ['', Validators.required]
    });

    this.firstName = this.patientForm.get('firstName');
    this.lastName = this.patientForm.get('lastName');
    this.middleName = this.patientForm.get('middleName');
    this.age = this.patientForm.get('age');
    this.legalStatus = this.patientForm.get('legalStatus');
    this.gender = this.patientForm.get('gender');
    this.address = this.patientForm.get('address');
    this.email = this.patientForm.get('email');
    this.registrationDate = this.patientForm.get('registrationDate');
    this.birthDate = this.patientForm.get('birthDate');

    this.firstName.valueChanges.subscribe(newValue => {
      this.errors.firstName = this.firstName.hasError('required') ? 'First Name is required' : '';
    });

    this.lastName.valueChanges.subscribe(newValue => {
      this.errors.lastName = this.lastName.hasError('required') ? 'Last Name is required' : '';
    });

    this.age.disable();

    this.legalStatus.valueChanges.subscribe(newValue => {
      this.errors.legalStatus = this.legalStatus.hasError('required') ? 'Marital Status is required' : '';
    });

    this.gender.valueChanges.subscribe(newValue => {
      this.errors.gender = this.gender.hasError('required') ? 'Gender is required' : '';
    });

    this.address.valueChanges.subscribe(newValue => {
      this.errors.address = this.address.hasError('required') ? 'Address is required' : '';
    });

    this.email.valueChanges.subscribe(newValue => {
      this.errors.email = this.email.hasError('required') ? 'Email is required.' : this.email.hasError('pattern') ? 'Invalid email address format' : '';
    });

    this.registrationDate.valueChanges.subscribe(newValue => {
      this.errors.registrationDate = this.registrationDate.hasError('required') ? 'Registration date is required' : '';
    });

    this.birthDate.valueChanges.subscribe(newValue => {
      this.errors.birthDate = this.birthDate.hasError('required') ? 'Birth Date is required' : '';
      this.age.setValue(Utilities.getAge(this.birthDate.value));
    });
  }

  private validateForm() {
    this.errors.lastName = this.lastName.hasError('required') ? 'Last Name is required' : '';
    this.errors.firstName = this.firstName.hasError('required') ? 'First Name is required' : '';
    // this.errors.age = this.age.hasError('required') ? 'Age is required' : '';
    this.errors.legalStatus = this.legalStatus.hasError('required') ? 'Marital Status is required' : '';
    this.errors.gender = this.gender.hasError('required') ? 'Gender is required' : '';
    this.errors.address = this.address.hasError('required') ? 'Address is required' : '';
    this.errors.registrationDate = this.registrationDate.hasError('required') ? 'Registration date is required' : '';
    this.errors.email = this.email.hasError('required') ? 'Email is required.' : this.email.hasError('pattern') ? 'Invalid email address format' : '';
    this.errors.birthDate = this.birthDate.hasError('required') ? 'Birth Date is required' : '';
    this.errors.contactNo = this.hasContact() ? '' : "Contact is required";
  }

  private markFormAsDirty() {
    Object.keys(this.patientForm.controls).forEach(key => {
      this.patientForm.get(key).markAsDirty();
    });
  }

  private bindPatientDetails() {
    this.patient.firstname = Utilities.formatName(this.firstName.value);
    this.patient.lastname = Utilities.formatName(this.lastName.value);
    this.patient.middlename = Utilities.formatName(this.middleName.value);
    this.patient.age = this.age.value;
    this.patient.legalStatus = this.legalStatus.value;
    this.patient.gender = this.gender.value;
    this.patient.address = this.address.value;
    this.patient.email = this.email.value;
    this.patient.startDate = this.registrationDate.value ? Utilities.transformDate(new Date(this.registrationDate.value)) : Utilities.transformDate(new Date());
    this.patient.birthDate = this.birthDate.value;
  }

  private bindPatientFormValues() {
    this.address.setValue(this.patient.address);
    this.age.setValue(this.patient.age);
    this.firstName.setValue(this.patient.firstname);
    this.lastName.setValue(this.patient.lastname);
    this.middleName.setValue(this.patient.middlename);
    this.gender.setValue(this.patient.gender);
    this.legalStatus.setValue(this.patient.legalStatus);
    this.email.setValue(this.patient.email);
    this.birthDate.setValue(Utilities.getISODate(this.patient.birthDate));
    this.registrationDate.setValue(Utilities.getISODate(this.patient.startDate));
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
        this.patientForm.get('middleName').markAsDirty();
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
      this.stack.push(this.patientService.deleteContacts(item.id));
    }

    this.patientForm.get('middleName').markAsDirty();
  }

  public hasContact() {
    if (this.contacts.value && this.contacts.value.length > 0) {
      this.errors.contactNo = '';
      return true;
    }

    return false;
  }

  private submitForm(event) {
    this.markFormAsDirty();
    this.validateForm();
    this.bindPatientDetails();

    if (this.patientForm.valid && this.hasContact()) {

      if (this.mode === MODE.add) {
        const customPatient = {
          patient: this.patient,
          contacts: this.contacts.value
        };

        this.patientService.createPatient(customPatient).flatMap(response => {
          if (response && response.status) {
            this.patient["id"] = response.result;
            const patientOwner = this.storage.getPatientOwnerSubjectValue();
            return this.patientService.createPatientAcess(patientOwner ? patientOwner : null, response.result);
          }
          return Observable.of(response);
        }).subscribe(response => {
          if (response && response.status) {
            if (!this.disableSubmit) {
              this.disableSubmit = true;
            }

            this.onSubmit.emit(this.patient);
            this.rootNav.pop();
          }
          event.dismissLoading();
        }, err => event.dismissLoading());

      } else {

        // TODO EDIT MODE BEHAVIOR
        this.patient.patientId = this.patientId;

        this.stack.push(this.patientService.setPatientDetails(this.patient));

        this.stack.executeFork().subscribe(response => {
          if (response) {
            const submit = response[this.stack.lastIndex];
            if (submit && submit.status) {

              this.patient["id"] = response[this.stack.lastIndex].result;
              this.onSubmit.emit(this.patient);

              const callback = this.params.get('callback');
              callback(this.patientId).then(() => {
                this.rootNav.pop();
              });
            }
          }
          event.dismissLoading();
        }, err => event.dismissLoading());
      }
    }
    else {
      event.dismissLoading();
    }

  }

  private getPatientDetails() {
    this.stack.push(this.patientService.getPatientDetails(this.patientId));

    this.stack.executeFork().subscribe(response => {
      if (response) {
        this.patient = response[0].result;
        this.bindPatientFormValues();
      }
    })
  }
}
