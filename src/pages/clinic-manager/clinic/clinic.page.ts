import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, NavParams } from "ionic-angular";

import { RootNavController } from '../../../services';

import { LOVS, MODE } from '../../../constants/constants'

import { ContactModal } from '../../../components/contact-modal/contact-modal.component';
import { ScheduleModal } from '../../../components/schedule-modal/schedule-modal.component';

import { ClinicManagerService } from '../clinic-manager.service';
import { Storage } from '../../../services/storage';
import { StackedServices } from '../../../utilities/utilities';

import { ArraySubject } from '../../../shared/model/model'

@Component({
    selector: 'clinic-page',
    templateUrl: 'clinic.html',
    providers: [ClinicManagerService]
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
    private stack: StackedServices;

    private clinic: any;
    private modifiedClinic: any;

    constructor(
        private alertController: AlertController,
        private formBuilder: FormBuilder,
        private modalController: ModalController,
        private params: NavParams,
        private rootNav: RootNavController,
        private clinicManagerService: ClinicManagerService,
        private storage: Storage) {
        this.getDefaults();
    }

    public ngOnInit() {
        this.clinic = this.params.get('clinic') ? Object.assign({}, this.params.get('clinic')) : {};
        this.schedules.value = this.clinic.schedules ? Object.assign([], this.clinic.schedules) : [];
        this.contacts.value = this.clinic.contacts ? Object.assign([], this.clinic.contacts) : [];
        this.mode = this.params.get('mode') ? this.params.get('mode') : MODE.add;
        this.createClinicForm();
    }

    private getDefaults() {
        this.schedules = new ArraySubject([]);
        this.contacts = new ArraySubject([]);

        this.errors = {
            clinicName: '',
            address: '',
            schedule: '',
            contact: '',
            affiliate: ''
        }

        this.mode = 'Add';
        this.days = LOVS.DAYS;
        this.contactTypes = LOVS.CONTACT_TYPE;
        this.stack = new StackedServices([]);
    }

    private createClinicForm() {
        this.clinicForm = this.formBuilder.group({
            clinicName: [this.clinic.clinicName, [Validators.required]],
            address: [this.clinic.address, [Validators.required]]
        });

        this.clinicName = this.clinicForm.get('clinicName');
        this.address = this.clinicForm.get('address');

        this.clinicName.valueChanges.subscribe(newValue => {
            this.errors.clinicName = this.clinicName.hasError('required') ? 'Clinic Name is required' : '';
        });

        this.address.valueChanges.subscribe(newValue => {
            this.errors.address = this.address.hasError('required') ? 'Address is required' : '';
        });
    }

    public createSchedule(event: Event) {
        event.preventDefault();

        let scheduleModal = this.modalController.create(ScheduleModal);

        scheduleModal.present();

        scheduleModal.onDidDismiss(schedule => {
            if (schedule) {
                this.addSchedule(schedule);
                this.hasSchedule();
            }
        });
    }

    private addSchedule(newSchedule) {
        const schedule = this.schedules.value.filter(s => s.dayOfWeek === newSchedule.dayOfWeek);
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

            this.schedules.value.filter(s => s.dayOfWeek === newSchedule.dayOfWeek)[0] = schedule[0];
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
                        this.hasSchedule();
                        if (this.mode !== MODE.add) {
                            this.stack.push(this.clinicManagerService.delTimeSlotsByClinIdAndDayOfWeek(this.clinic.clinicId, dayOfWeek));
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
                            this.hasSchedule();
                        }


                        if (this.mode !== MODE.add && time.id) {

                            if (deleteSchedule) {
                                this.stack.push(this.clinicManagerService.delTimeSlotsByClinIdAndDayOfWeek(this.clinic.clinicId, schedule.dayOfWeek));
                            } else {
                                this.stack.push(this.clinicManagerService.deleteClinicTimeslot(time.id));
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
                header: 'Add Clinic Contact'
            });
        modal.onDidDismiss(contact => {
            if (contact) {

                this.contacts.push({
                    contact: contact.contact,
                    contactType: contact.contactType
                });
                this.hasContact();
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
                        this.hasContact();
                        if (this.mode !== MODE.add && contact.id) {
                            this.stack.push(this.clinicManagerService.deleteClinicContact(contact.id));
                        }
                    }
                }
            ]
        }).present();
    }

    public hasContact() {
        if (this.contacts.value && this.contacts.value.length > 0) {
            this.errors.contact = '';
            return true;
        }

        return false;
    }

    private hasSchedule() {
        if (this.schedules.value && this.schedules.value.length > 0) {
            this.errors.schedule = '';
            return true;
        }

        return false;
    }

    private markFormAsDirty() {
        Object.keys(this.clinicForm.controls).forEach(key => {
            this.clinicForm.get(key).markAsDirty();
        });
    }

    private validateForm() {
        this.errors.clinicName = this.clinicName.hasError('required') ? 'Clinic Name is required' : '';
        this.errors.address = this.address.hasError('required') ? 'Address is required' : '';
        this.errors.contact = this.hasContact() ? '' : "Contact is required";
        this.errors.schedule = this.hasSchedule() ? '' : "Schedule is required";
    }

    private updateClinicDetailStorage() {
        if (this.modifiedClinic) {
            this.storage.clinic = this.modifiedClinic;
        }
    }

    private popPage(response) {
        const callback = this.params.get('callback');
        callback(response).then(() => {
            this.rootNav.pop();
        });
    }

    public submitForm(event) {
        this.markFormAsDirty();
        this.validateForm();

        if (this.clinicForm.valid && this.hasContact() && this.hasSchedule()) {

            if (this.mode === MODE.add) {
                const newClinic = {
                    clinicName: this.clinicName.value,
                    address: this.address.value,
                    schedules: this.schedules.value,
                    contacts: this.contacts.value
                };

                this.clinicManagerService.createClinic(newClinic).subscribe(response => {
                    if (response && response.status) {
                        this.popPage(response);
                    }
                    event.dismissLoading();
                }, err => event.dismissLoading());

            } else {
                this.contacts.value.filter(contact => !contact.id).forEach(contact => {
                    this.stack.push(this.clinicManagerService.createClinicContact({
                        clinicId: this.clinic.clinicId,
                        contact: contact.contact,
                        contactType: contact.contactType,
                    }));
                });

                this.schedules.value.forEach(schedule => {
                    schedule.timeSlot.filter(time => !time.id).forEach(time => {
                        this.stack.push(this.clinicManagerService.createClinicTimeslot({
                            clinicId: this.clinic.clinicId,
                            dayOfWeek: schedule.dayOfWeek,
                            startTime: time.startTime,
                            endTime: time.endTime,
                        }));
                    });
                });

                this.modifiedClinic = {
                    clinicId: this.clinic.clinicId,
                    clinicName: this.clinicName.value,
                    address: this.address.value,
                    affiliateId: this.clinic.affiliateId
                };

                this.stack.push(this.clinicManagerService.updateClinicDetailRecord(this.modifiedClinic));

                this.stack.executeFork().subscribe(response => {
                    if (response) {
                        const submit = response[this.stack.lastIndex];

                        if (submit && submit.status) {
                            const clinicSubject = this.storage.getClinicSubjectValue();

                            if (clinicSubject && clinicSubject.clinicId === this.clinic.clinicId) {
                                this.updateClinicDetailStorage();
                            }

                            this.popPage(response);
                        }
                    }
                    event.dismissLoading();
                }, err => event.dismissLoading());
            }
        } else {
            event.dismissLoading();
        }
    }
}
