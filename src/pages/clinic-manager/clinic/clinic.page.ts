import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavParams } from "ionic-angular";

import { RootNavController } from '../../../services/services';

@Component({
    selector: 'clinic-page',
    templateUrl: 'clinic.html'
})
export class ClinicPage implements OnInit {

    public clinicForm: FormGroup;

    public errors: any;
    public mode: string;

    private clinic: any;

    constructor(
        private formBuilder: FormBuilder,
        private rootNav: RootNavController) {
        this.getDefaults();
    }

    public ngOnInit() {
        this.clinic = {} // TODO get from navparams 

        this.createClinicForm();

    }

    private getDefaults() {
        this.errors = {
            name: '',
            address: '',
            schedule: '',
            contact: ''
        }

        this.mode = 'Add'
    }

    private createClinicForm() {
        this.clinicForm = this.formBuilder.group({
            name: [this.clinic.name, [Validators.required]],
            address: [this.clinic.name, [Validators.required]],
        });

        const name = this.clinicForm.get('name');
        const address = this.clinicForm.get('address');

        name.valueChanges.subscribe(
            newValue => {
                if (name.hasError('required')) {
                    this.errors.name = 'Name is required';
                } else {
                    this.errors.name = '';
                }
            }
        );

        address.valueChanges.subscribe(
            newValue => {
                if (address.hasError('required')) {
                    this.errors.address = 'Address is required';
                } else {
                    this.errors.address = '';
                }
            }
        );
    }

    public isEditMode(): boolean {
        return this.mode !== 'View';
    }

    public submitForm(event) {

    }
}