import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams } from "ionic-angular";

import { RootNavController } from '../../../services/services';

import { LOVS } from '../../../constants/constants'

import { ScheduleModal } from '../schedule-modal/schedule-modal';

@Component({
    selector: 'clinic-page',
    templateUrl: 'clinic.html'
})
export class ClinicPage implements OnInit {

    public clinicForm: FormGroup;

    public errors: any;
    public days: any;
    public schedules;
    public mode: string;

    private clinic: any;


    constructor(
        private formBuilder: FormBuilder,
        private modalController: ModalController,
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

        this.mode = 'Add';
        this.days = LOVS.DAYS;
    }

    private createClinicForm() {
        this.clinicForm = this.formBuilder.group({
            name: [this.clinic.name, [Validators.required]],
            address: [this.clinic.name, [Validators.required]]
            // ,schedules: this.formBuilder.array([]),
            // contacts: this.formBuilder.array([])
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

    public createSchedule() {
        let scheduleModal = this.modalController.create(ScheduleModal, {
            enableBackdropDismiss: false,
            showBackdrop: true
        });
        scheduleModal.present();

        scheduleModal.onDidDismiss(response => {
            console.log('scheduleModal dismiss => ' + JSON.stringify(response));
            // TODO CREATE SCHEDULE FORM array
        });

        // const schedules = <FormArray>this.clinicForm.get('schedules');
        // schedules.push(this.initSchedules());
    }

    private initSchedules() {
        const schedForm = <FormGroup>this.formBuilder.group({
            day: ['', Validators.required],
            from: ['', Validators.required],
            to: ['', Validators.required]
        });

        return schedForm;
    }

    public submitForm(event) {
        console.log(this.clinicForm.value);
        event.dismissLoading();
    }
}