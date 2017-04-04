import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

    public schedules: any;
    public contactList: any;

    public errors: any;
    public days: any;
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
        this.schedules = [];

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

        scheduleModal.onDidDismiss(schedule => {
            this.addSchedule(schedule);
        });
    }

    private addSchedule(newSchedule) {
        const schedule = this.schedules.filter(s => { return s.day === newSchedule.day });

        if (schedule.length === 0) {

            this.schedules.push(
                {
                    day: newSchedule.day,
                    time: [{
                        from: newSchedule.from,
                        to: newSchedule.to
                    }]
                }
            );

        } else {
            this.schedules.filter(s => { return s.day === newSchedule.day })[0].time.push({
                from: newSchedule.from,
                to: newSchedule.to
            });

            this.schedules.filter(s => { return s.day === newSchedule.day })[0].time.sort(function (a, b) {
                return new Date('1970/01/01 ' + a.from).getTime() - new Date('1970/01/01 ' + b.from).getTime();
            });
        }
    }

    public getDay(day) {
        return this.days.filter(d => {
            return d.code === day;
        })[0].description;
    }

    public submitForm(event) {
        console.log(this.clinicForm.value);
        event.dismissLoading();
    }
}