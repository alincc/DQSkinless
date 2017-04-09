import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, NavParams } from "ionic-angular";

import { RootNavController } from '../../../services/services';

import { LOVS } from '../../../constants/constants'

import { ContactModal } from '../../../components/contact-modal/contact-modal.component';
import { ScheduleModal } from '../../../components/schedule-modal/schedule-modal';

import { ClinicManagerService } from '../clinic-manager.service';

@Component({
    selector: 'clinic-page',
    templateUrl: 'clinic.html',
    providers: [ClinicManagerService]
})
export class ClinicPage implements OnInit {

    public clinicForm: FormGroup;

    public schedules: any;
    public contacts: any;

    public errors: any;
    public days: any;
    public contactTypes: any;
    public mode: string;

    private clinic: any;

    private callback: Function;

    constructor(
        private alertController: AlertController,
        private formBuilder: FormBuilder,
        private modalController: ModalController,
        private params: NavParams,
        private rootNav: RootNavController,
        private clinicManagerService: ClinicManagerService) {
        this.getDefaults();
    }

    public ngOnInit() {
        this.clinic = this.params.get('clinic') ? this.params.get('clinic') : {};
        this.schedules = this.clinic.schedules ? this.clinic.schedules : []
        this.contacts = this.clinic.contacts ? this.clinic.contacts : []
        this.mode = this.params.get('mode') ? this.params.get('mode') : 'Add';
        this.createClinicForm();
        this.getUserContacts();
    }

    private getDefaults() {
        this.schedules = [];
        this.contacts = [];

        this.errors = {
            name: '',
            address: '',
            schedule: '',
            contact: ''
        }

        this.mode = 'Add';
        this.days = LOVS.DAYS;
        this.contactTypes = LOVS.CONTACT_TYPE;
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

    private getUserContacts() {
        this.clinicManagerService.getUserContacts().subscribe(response => {
            if (response && response.status) {
                console.log(response);
            }
        });
    }

    public isEditMode(): boolean {
        return this.mode !== 'View';
    }

    public createSchedule(event: Event) {
        event.preventDefault();

        let scheduleModal = this.modalController.create(ScheduleModal);
        scheduleModal.present();

        scheduleModal.onDidDismiss(schedule => {
            if (schedule) {
                this.addSchedule(schedule);
            }
        });
    }

    private addSchedule(newSchedule) {
        const schedule = this.schedules.filter(s => { return s.day === newSchedule.day });

        if (schedule.length === 0) {
            this.schedules.push(
                {
                    day: newSchedule.day,
                    times: [{
                        from: newSchedule.from,
                        to: newSchedule.to
                    }]
                }
            );
        } else {
            this.schedules.filter(s => { return s.day === newSchedule.day })[0].times.push({
                from: newSchedule.from,
                to: newSchedule.to
            });

            this.schedules.filter(s => { return s.day === newSchedule.day })[0].times.sort(function (a, b) {
                return new Date('1970/01/01 ' + a.from).getTime() - new Date('1970/01/01 ' + b.from).getTime();
            });
        }
    }

    public removeSchedule(event: Event, day, schedules, i) {
        event.preventDefault();

        this.alertController.create({
            message: `Remove ${this.days[day]} schedule?`,
            buttons: [
                {
                    text: 'NO',
                    role: 'cancel',
                },
                {
                    text: 'YES',
                    handler: () => {
                        this.schedules.splice(i, 1);
                    }
                }
            ]
        }).present();
    }

    public removeTime(event: Event, day, time, times, i) {
        event.preventDefault();

        this.alertController.create({
            message: `Remove ${time.from} to ${time.to} for ${this.days[day]} schedule?`,
            buttons: [
                {
                    text: 'NO',
                    role: 'cancel',
                },
                {
                    text: 'YES',
                    handler: () => {
                        times.splice(i, 1);
                    }
                }
            ]
        }).present();
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
            }
        });
        modal.present();
    }

    public removeContact(event, idx) {
        event.preventDefault();
        this.contacts.splice(idx, 1);
    }

    private validateContacts() {
        if (this.contacts.length === 0) {
            this.errors.contact = 'Contact is required';
            return false;
        }

        return true;
    }

    private validateSchedules() {
        if (this.schedules.length === 0) {
            this.errors.schedule = 'Schedule is required';
            return false;
        }

        return true;
    }

    public submitForm(event) {
        event.event.preventDefault();

        if (this.clinicForm.valid && (this.validateContacts() || this.validateSchedules())) {
            this.callback = this.params.get('callback');

            const newClinic = {
                name: this.clinicForm.get('name').value,
                address: this.clinicForm.get('address').value,
                schedules: this.schedules,
                contacts: this.contacts
            };

            // TODO SAVING

            this.callback(newClinic).then(() => {
                console.log(JSON.stringify(newClinic));
                this.rootNav.pop();
            });

        }

        event.dismissLoading();
    }
}