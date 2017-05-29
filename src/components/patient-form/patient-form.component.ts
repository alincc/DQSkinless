import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController } from 'ionic-angular';

/**
 * Generated class for the PatientForm component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'patient-form',
  templateUrl: 'patient-form.html'
})
export class PatientForm implements OnInit {

  @Input() patient: any;

  @Output() onSubmit = new EventEmitter();

  private patientForm: FormGroup;

  private firstName: AbstractControl;
  private lastName: AbstractControl
  private age: AbstractControl;
  private sex: AbstractControl;
  private address: AbstractControl;
  private contact: AbstractControl;
  private email: AbstractControl;
  private registrationDate: AbstractControl;

  private errors: any;

  constructor(private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private modalController: ModalController) {
    this.getDefaults();
  }

  public ngOnInit() {
    this.createForm();
  }

  private getDefaults() {

    this.errors = {
      firstName: '',
      lastName: '',
      confirm: '',
      age: '',
      sex: '',
      address: '',
      email: '',
      registrationDate: ''
    };
  }

  private createForm() {
    this.patientForm = this.formBuilder.group({
      firstName: '',
      lastName: '',
      age: '',
      sex: '',
      address: '',
      email: '',
      registrationDate: ''
    });

    this.firstName = this.patientForm.get("firstName");
    this.lastName = this.patientForm.get("lastName");
    this.age = this.patientForm.get("age");
    this.sex = this.patientForm.get("sex");
    this.address = this.patientForm.get("address");
    this.email = this.patientForm.get("email");
    this.registrationDate = this.patientForm.get("registrationDate");

    this.firstName.valueChanges.subscribe(newValue => {
      this.errors.firstName = '';
    });

    this.lastName.valueChanges.subscribe(newValue => {
      this.errors.lastName = '';
    });

    this.age.valueChanges.subscribe(newValue => {
      this.errors.age = '';
    });

    this.sex.valueChanges.subscribe(newValue => {
      this.errors.sex = '';
    });

    this.address.valueChanges.subscribe(newValue => {
      this.errors.address = '';
    });

    this.email.valueChanges.subscribe(newValue => {
      this.errors.email = '';
    });

    this.registrationDate.valueChanges.subscribe(newValue => {
      this.errors.registrationDate = '';
    });
  }

  private validateForm() {
    this.errors.lastName = this.lastName.hasError('required') ? 'Last Name is required' : '';
    this.errors.firstName = this.firstName.hasError('required') ? 'First Name is required' : '';
    this.errors.age = this.age.hasError('required') ? 'Age is required' : '';
    this.errors.sex = this.sex.hasError('required') ? 'Sex is required' : '';
    this.errors.address = this.address.hasError('required') ? 'Address is required' : '';
    this.errors.registrationDate = this.registrationDate.hasError('required') ? 'Registration date is required' : '';
    this.errors.email = this.email.hasError('required') ? 'Email is required' : '';

  }

  private markFormAsDirty() {
    Object.keys(this.patientForm.controls).forEach(key => {
      this.patientForm.get(key).markAsDirty();
    });
  }

  private submitForm(event) {
    this.markFormAsDirty();
    this.validateForm();
    
  }

  private bindPatientDetails(){
    this.patient.firstName = this.patientForm.get("firstName");
    this.patient.lastName = this.patientForm.get("lastName");
    this.patient.age = this.patientForm.get("age");
    this.patient.sex = this.patientForm.get("sex");
    this.patient.address = this.patientForm.get("address");
    this.patient.email = this.patientForm.get("email");
    this.patient.registrationDate = this.patientForm.get("registrationDate");
  }
}
