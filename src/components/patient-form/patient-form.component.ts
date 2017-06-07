import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController } from 'ionic-angular';
import { LOVS } from '../../constants/constants';
import { REGEX } from '../../config/config';

import { PatientService } from './patient-form.service';
import { StackedServices, Utilities } from '../../utilities/utilities';

@Component({
  selector: 'patient-form',
  templateUrl: 'patient-form.html',
  providers: [PatientService]
})
export class PatientForm implements OnInit {

  @Input() patient: any;

  @Output() onSubmit = new EventEmitter();

  @ViewChild('dateTime') dateTime;

  private patientForm: FormGroup;
  public genderList: any[];
  public legalStatusList: any[];

  private firstName: AbstractControl;
  private lastName: AbstractControl;
  private middleName: AbstractControl;
  private age: AbstractControl;
  private legalStatus: AbstractControl;
  private gender: AbstractControl;
  private address: AbstractControl;
  private contact: AbstractControl;
  private email: AbstractControl;
  private registrationDate: AbstractControl;
  private birthDate: AbstractControl;
  private stack: StackedServices;

  private errors: any;

  constructor(private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private service: PatientService, ) {
    this.getDefaults();
  }

  public ngOnInit() {
    this.patient = {};
    this.createForm();
  }

  private getDefaults() {

    this.errors = {
      firstName: '',
      lastName: '',
      middleName: '',
      confirm: '',
      age: '',
      legalStatus: '',
      gender: '',
      address: '',
      email: '',
      registrationDate: '',
      birthDate: ''
    };

    this.genderList = LOVS.GENDER;
    this.legalStatusList = LOVS.LEGAL_STATUS;
    this.stack = new StackedServices([]);
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
      registrationDate: [Utilities.getISODate(new Date()), Validators.required],
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

    this.age.valueChanges.subscribe(newValue => {
      this.errors.age = this.age.hasError('required') ? 'Age is required' : '';
    });

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
      this.errors.email = this.email.hasError('required') ? 'Email is required' : '';
    });

    this.registrationDate.valueChanges.subscribe(newValue => {
      this.errors.registrationDate = this.registrationDate.hasError('required') ? 'Registration date is required' : '';
    });

    this.birthDate.valueChanges.subscribe(newValue => {
      this.errors.birthDate = this.birthDate.hasError('required') ? 'Birth Date is required' : '';
    });
  }

  private validateForm() {
    this.errors.lastName = this.lastName.hasError('required') ? 'Last Name is required' : '';
    this.errors.firstName = this.firstName.hasError('required') ? 'First Name is required' : '';
    this.errors.age = this.age.hasError('required') ? 'Age is required' : '';
    this.errors.legalStatus = this.legalStatus.hasError('required') ? 'Marital Status is required' : '';
    this.errors.gender = this.gender.hasError('required') ? 'Gender is required' : '';
    this.errors.address = this.address.hasError('required') ? 'Address is required' : '';
    this.errors.registrationDate = this.registrationDate.hasError('required') ? 'Registration date is required' : '';
    this.errors.email = this.email.hasError('required') ? 'Email is required' : '';
    this.errors.birthDate = this.birthDate.hasError('required') ? 'Birth Date is required' : '';
  }

  private markFormAsDirty() {
    Object.keys(this.patientForm.controls).forEach(key => {
      this.patientForm.get(key).markAsDirty();
    });
  }

  private bindPatientDetails() {
    this.patient.firstname = this.patientForm.get('firstName').value;
    this.patient.lastname = this.patientForm.get('lastName').value;
    this.patient.middlename = this.patientForm.get('middleName').value;
    this.patient.age = this.patientForm.get('age').value;
    this.patient.legalStatus = this.patientForm.get('legalStatus').value;
    this.patient.gender = this.patientForm.get('gender').value;
    this.patient.address = this.patientForm.get('address').value;
    this.patient.email = this.patientForm.get('email').value;
    this.patient.startDate = this.patientForm.get('registrationDate').value ? Utilities.transformDate(new Date(this.patientForm.get('registrationDate').value)) : Utilities.transformDate(new Date());
    this.patient.birthDate = this.patientForm.get('birthDate').value;
  }

  private submitForm(event) {
    this.markFormAsDirty();
    this.validateForm();

    if (this.patientForm.valid) {
      this.bindPatientDetails();

      this.stack.push(this.service.addPatientDetails(this.patient));

      this.stack.executeFork().subscribe(response => {
        if (response) {
          const submit = response[this.stack.lastIndex];

          if (submit && submit.status) {
            this.onSubmit.emit(this.patient);
          }
        }
        event.dismissLoading();
      }, err => event.dismissLoading());
    }
    else {
      event.dismissLoading();
    }
  }
}
