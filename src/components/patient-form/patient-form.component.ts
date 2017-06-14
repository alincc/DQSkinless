import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, NavParams } from 'ionic-angular';
import { LOVS, MODE } from '../../constants/constants';
import { REGEX } from '../../config/config';

import { ContactModal } from '../contact-modal/contact-modal.component';
import { ArraySubject } from '../../shared/model/model';

import { PatientFormService } from './patient-form.service';
import { StackedServices, Utilities } from '../../utilities/utilities';
import { RootNavController } from '../../services';

import { PatientProfilePage } from '../../pages/patient-profile/patient-profile.page';

@Component({
  selector: 'patient-form',
  templateUrl: 'patient-form.html',
  providers: [PatientFormService]
})
export class PatientForm implements OnInit {

  @Input() patient: any;

  @Output() onSubmit = new EventEmitter();

  private patientForm: FormGroup;
  public contactType: any[];
  public genderList: any[];
  public legalStatusList: any[];
  public mode: string;
  @Input() patientId: any;

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


  private contacts: ArraySubject = new ArraySubject([]);

  private errors: any;

  constructor(
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private rootNav: RootNavController,
    private params: NavParams,
    private patientService: PatientFormService) {
    this.getDefaults();
  }

  public ngOnInit() {
    this.patient = {};
    this.mode = this.params.get('mode') ? this.params.get('mode') : MODE.add;
    this.patientId = this.params.get('patientId');
    this.createForm();
    this.contactType = LOVS.CONTACT_TYPE;
    
    if(this.patientId){
      
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
    this.patient.firstname = this.firstName.value;
    this.patient.lastname = this.lastName.value;
    this.patient.middlename = this.middleName.value;
    this.patient.age = this.age.value;
    this.patient.legalStatus = this.legalStatus.value;
    this.patient.gender = this.gender.value;
    this.patient.address = this.address.value;
    this.patient.email = this.email.value;
    this.patient.startDate = this.registrationDate.value ? Utilities.transformDate(new Date(this.registrationDate.value)) : Utilities.transformDate(new Date());
    this.patient.birthDate = this.birthDate.value;
  }

  private bindPatientFormValues(){
    this.patientForm.get('address').setValue(this.patient.address);
    this.patientForm.get('age').setValue(this.patient.age);
    this.patientForm.get('firstName').setValue(this.patient.firstname);
    this.patientForm.get('lastName').setValue(this.patient.lastname);
    this.patientForm.get('middleName').setValue(this.patient.middlename);
    this.patientForm.get('gender').setValue(this.patient.gender);
    this.patientForm.get('legalStatus').setValue(this.patient.legalStatus);
    this.patientForm.get('birthDate').setValue(new Date(+this.patient.birthDate).toISOString());
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

// <<<<<<< HEAD
//     if (this.patientForm.valid) {
//       this.bindPatientDetails();
//       this.patient.contacts = this.contacts.value;

//       if (isNaN(this.patientId)) {
//         this.stack.push(this.service.addPatientDetails(this.patient));

//         this.stack.executeFork().subscribe(response => {
//           if (response) {
//             const submit = response[this.stack.lastIndex];

//             if (submit && submit.status) {
//               this.onSubmit.emit(this.patient);
//             }
//           }
//           event.dismissLoading();

//           this.rootNav.pop();
//         }, err => event.dismissLoading());
//       }
//       else {
//         this.patient.patientId = this.patientId;
//         this.stack.push(this.service.setPatientDetails(this.patient));
// =======
    if (this.patientForm.valid && this.hasContact()) {

      if (this.mode === MODE.add) {
        const customPatient = {
          patient: this.patient,
          contacts: this.contacts.value
        };

        this.patientService.createPatient(customPatient).subscribe(response => {
          if (response && response.status) {
            this.onSubmit.emit(this.patient);
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
              this.onSubmit.emit(this.patient);
            }
          }
          event.dismissLoading();
        }, err => event.dismissLoading());
      }
    }
    else {
      event.dismissLoading();
    }

    this.stack.clearStack();
  }

  private getPatientDetails(){
      this.stack.push(this.patientService.getPatientDetails(this.patientId));

      this.stack.executeFork().subscribe(response => {
        if(response){
          this.patient = response[0].result;
          this.bindPatientFormValues();
        }
      })
  }
}
