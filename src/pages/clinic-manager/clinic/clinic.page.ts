import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, NavParams } from "ionic-angular";

import { RootNavController } from '../../../services/services';

import { LOVS, MODE } from '../../../constants/constants'

import { ContactModal } from '../../../components/contact-modal/contact-modal.component';
import { ScheduleModal } from '../../../components/schedule-modal/schedule-modal';

import { ClinicManagerService } from '../clinic-manager.service';
import { StackedServices } from '../../../services/services';

import { ArraySubject } from '../../../shared/model/model'

@Component({
    selector: 'clinic-page',
    templateUrl: 'clinic.html',
    providers: [ClinicManagerService, StackedServices]
})
export class ClinicPage implements OnInit {

    public clinicForm: FormGroup;

    public schedules: ArraySubject;
    public contacts: ArraySubject;

    public errors: any;
    public days: any;
    public contactTypes: any;
    public mode: string;

    private address: AbstractControl;
    private clinicName: AbstractControl;
    private clinic: any;

    constructor(
        private alertController: AlertController,
        private formBuilder: FormBuilder,
        private modalController: ModalController,
        private params: NavParams,
        private rootNav: RootNavController,
        private clinicManagerService: ClinicManagerService,
        private stackedServices: StackedServices) {
        this.getDefaults();
    }

    public ngOnInit() {

        this.clinic = this.params.get('clinic') ? Object.assign({}, this.params.get('clinic')) : {};
        this.schedules.value = this.clinic.schedules ? Object.assign([], this.clinic.schedules) : [];
        this.contacts.value = this.clinic.contacts ? Object.assign([], this.clinic.contacts) : [];
        this.mode = this.params.get('mode') ? this.params.get('mode') : MODE.add;
        this.createClinicForm();

        if (this.mode === MODE.add) {
            this.getUserContacts();
        }
    }

    private getDefaults() {
        this.schedules = new ArraySubject([]);
        this.contacts = new ArraySubject([]);

        this.errors = {
            clinicName: '',
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
            clinicName: [this.clinic.clinicName, [Validators.required]],
            address: [this.clinic.address, [Validators.required]]
        });

        this.clinicName = this.clinicForm.get('clinicName');
        this.address = this.clinicForm.get('address');

        this.clinicName.valueChanges.subscribe(
            newValue => {
                if (this.clinicName.hasError('required')) {
                    this.errors.clinicName = 'Clinic Name is required';
                } else {
                    this.errors.clinicName = '';
                }
            }
        );

        this.address.valueChanges.subscribe(
            newValue => {
                if (this.address.hasError('required')) {
                    this.errors.address = 'Address is required';
                } else {
                    this.errors.address = '';
                }
            }
        );

        this.schedules.subscribe(newValue => {
            if (newValue)
                this.errors.schedule = newValue.length ? '' : "Schedule is required";
        })

        this.contacts.subscribe(newValue => {
            if (newValue)
                this.errors.contact = newValue.length ? '' : "Contact is required";
        })
    }

    private getUserContacts() {
        this.clinicManagerService.getUserContacts().subscribe(response => {
            if (response && response.status) {
                response.result.forEach(contact => {
                    this.contacts.push({
                        contactType: contact.contactType,
                        contact: contact.contact,
                        isProfileContacts: true
                    });
                });
            }
        });
    }

    public createSchedule(event: Event) {
        event.preventDefault();

        let scheduleModal = this.modalController.create(ScheduleModal);

        scheduleModal.present();

        scheduleModal.onDidDismiss(schedule => {
            if (schedule) {
                this.addSchedule(schedule);

                // this.clinicForm.markAsDirty();
            }
        });
    }

    private addSchedule(newSchedule) {
        const schedule = this.schedules.value.filter(s => { return s.dayOfWeek === newSchedule.dayOfWeek });
        if (schedule.length === 0) {
            this.schedules.push(
                {
                    dayOfWeek: newSchedule.dayOfWeek,
                    timeSlot: [{
                        startTime: newSchedule.startTime,
                        endTime: newSchedule.endTime
                    }]
                }
            );
        } else {
            schedule[0].timeSlot.push({
                startTime: newSchedule.startTime,
                endTime: newSchedule.endTime
            });

            schedule[0].timeSlot.sort(function (a, b) {
                return new Date('1970/01/01 ' + a.startTime).getTime() - new Date('1970/01/01 ' + b.startTime).getTime();
            });

            this.schedules.value.filter(s => { return s.dayOfWeek === newSchedule.dayOfWeek })[0] = schedule[0];
        }
    }

    public removeSchedule(event: Event, dayOfWeek, schedules, si) {
        event.preventDefault();

        this.alertController.create({
            message: `Remove ${this.days[dayOfWeek]} schedule?`,
            buttons: [
                {
                    text: 'NO',
                    role: 'cancel',
                },
                {
                    text: 'YES',
                    handler: () => {
                        this.schedules.splice(si, 1);
                        if (this.mode !== MODE.add) {
                            this.stackedServices.push(this.clinicManagerService.delTimeSlotsByClinIdAndDayOfWeek(this.clinic.clinicId, dayOfWeek));
                        }
                    }
                }
            ]
        }).present();
    }

    public removeTimeSlot(event: Event, schedule, time, ti, si) {
        event.preventDefault();
        const deleteSchedule = schedule.timeSlot.length === 1;
        const message = deleteSchedule ?
            `No time slot will be left for ${this.days[schedule.dayOfWeek]}. ${this.days[schedule.dayOfWeek]} schedule will be removed? ` :
            `Remove ${time.startTime} to ${time.endTime} for ${this.days[schedule.dayOfWeek]} schedule?`;

        this.alertController.create({
            message: message,
            buttons: [
                {
                    text: 'NO',
                    role: 'cancel',
                },
                {
                    text: 'YES',
                    handler: () => {

                        schedule.timeSlot.splice(ti, 1);

                        if (deleteSchedule) {
                            this.schedules.splice(si, 1);
                        }


                        if (this.mode !== MODE.add && time.id) {

                            if (deleteSchedule) {
                                this.stackedServices.push(this.clinicManagerService.delTimeSlotsByClinIdAndDayOfWeek(this.clinic.clinicId, schedule.dayOfWeek));
                            } else {
                                this.stackedServices.push(this.clinicManagerService.deleteClinicTimeslot(time.id));
                            }

                        }
                    }
                }
            ]
        }).present();
    }

    public addContact(event: Event): void {
        event.preventDefault();
        let modal = this.modalController.create(ContactModal,
            {
                header: 'Add User Contact'
            });
        modal.onDidDismiss(contact => {
            if (contact) {

                this.contacts.push({
                    contact: contact.contact,
                    contactType: contact.contactType,
                    isProfileContacts: false
                });

                // this.clinicForm.markAsDirty();
            }
        });
        modal.present();
    }

    public removeContact(event, contact, idx) {
        event.preventDefault();
        this.alertController.create({
            message: `Remove ${contact.contact}?`,
            buttons: [
                {
                    text: 'NO',
                    role: 'cancel',
                },
                {
                    text: 'YES',
                    handler: () => {
                        this.contacts.splice(idx, 1);
                        if (this.mode !== MODE.add && contact.id) {
                            this.stackedServices.push(this.clinicManagerService.deleteClinicContact(contact.id));
                        }
                    }
                }
            ]
        }).present();
    }

    private hasContact() {
        return !Boolean(this.errors.contact);
    }

    private hasSchedule() {
        return !Boolean(this.errors.schedule);
    }

    public submitForm(event) {
        this.markFormAsDirty();
        this.validateForm();
        if (this.clinicForm.valid && this.hasContact() && this.hasSchedule()) {

            if (this.mode === MODE.add) {
                const newClinic = {
                    clinicName: this.clinicForm.get('clinicName').value,
                    address: this.clinicForm.get('address').value,
                    schedules: this.schedules.value,
                    contacts: this.filterContacts(this.contacts.value)
                };

                this.clinicManagerService.createClinic(newClinic).subscribe(response => {
                    if (response && response.status) {

                        const callback = this.params.get('callback');
                        callback(response).then(() => {
                            this.rootNav.pop();
                        });
                    }
                    event.dismissLoading();
                }, err => {
                    event.dismissLoading();
                });

            } else {

                this.contacts.value.filter(contact => { return !contact.id }).forEach(contact => {
                    this.stackedServices.push(this.clinicManagerService.createClinicContact({
                        clinicId: this.clinic.clinicId,
                        contact: contact.contact,
                        contactType: contact.contactType,
                    }));
                });

                this.schedules.value.forEach(schedule => {
                    schedule.timeSlot.filter(time => { return !time.id }).forEach(time => {
                        this.stackedServices.push(this.clinicManagerService.createClinicTimeslot({
                            clinicId: this.clinic.clinicId,
                            dayOfWeek: schedule.dayOfWeek,
                            startTime: time.startTime,
                            endTime: time.endTime,
                        }));
                    });
                });

                const modifiedClinic = {
                    clinicId: this.clinic.clinicId,
                    clinicName: this.clinicForm.get('clinicName').value,
                    address: this.clinicForm.get('address').value,
                }

                this.stackedServices.push(this.clinicManagerService.updateClinicDetailRecord(modifiedClinic));

                this.stackedServices.executeFork().subscribe(response => {

                    if (response) {
                        const submit = response[this.stackedServices.lastIndex];

                        if (submit && submit.status) {
                            const callback = this.params.get('callback');
                            callback(response).then(() => {
                                this.rootNav.pop();
                            });
                        }
                    }

                    event.dismissLoading();
                }, err => event.dismissLoading());
            }
        } else {
            event.dismissLoading();
        }
    }

    private markFormAsDirty() {
        Object.keys(this.clinicForm.controls).forEach(key => {
            this.clinicForm.get(key).markAsDirty();
        });
    }

    private validateForm() {
        if (this.clinicName.hasError('required')) {
            this.errors.clinicName = 'Clinic Name is required';
        } else {
            this.errors.clinicName = '';
        }

        if (this.address.hasError('required')) {
            this.errors.address = 'Address is required';
        } else {
            this.errors.address = '';
        }
    }

    private filterContacts(conacts) {
        const newContacts = [];
        this.contacts.value.filter(contact => {
            return !contact.isProfileContacts;
        }).forEach(contact => {
            delete contact['isProfileContacts'];
            newContacts.push(contact);
        });

        return newContacts;
    }
}
