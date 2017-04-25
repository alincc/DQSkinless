import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';

import { HttpService, Storage } from '../../services/services';
import { CONFIG } from '../../config/config';

@Injectable()
export class ClinicManagerService {

    private
    constructor(
        private http: HttpService,
        private storage: Storage) { }

    private userId;

    private getUserId() {
        if (!this.userId) {
            this.userId = this.storage.userDetails.userId;
        }
        return this.userId;
    }

    public getNoOfClinics() {
        return this.http.get(CONFIG.API.getNoOfClinics, [this.getUserId()]);
    }

    public getUserContacts() {
        return this.http.get(CONFIG.API.getUserContacts, [this.getUserId()]);
    }

    public createClinic(clinic) {
        clinic.userId = this.getUserId();
        return this.http.post(CONFIG.API.createClinic, clinic);
    }


    public getClinicRecord() {
        return this.getClinicRecordByUserId().map(response => {
            if (response && response.status) {
                return response.result;
            }

            return [];

        }).flatMap(clinics => {
            const customClinic = [];

            clinics.forEach(clinic => {
                Observable.forkJoin([
                    this.getClinicTimeSlotByClinicId(clinic.clinicId),
                    this.getClinicContactByClinicId(clinic.clinicId),
                    this.getUserContacts()
                ]).map((data: any[]) => {
                    clinic.schedules = [];
                    clinic.contacts = [];

                    const clinicSchedules = data[0]
                    const clinicContacts = data[1];
                    const userContacts = data[2];

                    if (clinicSchedules && clinicSchedules.status) {
                        clinicSchedules.result.forEach(clinicSchedule => {
                            this.pushClinicSchedule(clinic.schedules, clinicSchedule);
                        });
                    }

                    if (clinicContacts && clinicContacts.status) {
                        clinicContacts.result.forEach(clinicContact => {
                            this.pushClinicContact(clinic.contacts, clinicContact, false);
                        });
                    }

                    if (userContacts && userContacts.status) {
                        userContacts.result.forEach(userContact => {
                            this.pushClinicContact(clinic.contacts, userContact, true);
                        });
                    }

                    return clinic;

                }).subscribe(clinic => {
                    console.log(`Retrieved clinic details for user: ${this.getUserId()}`);
                    console.log(JSON.stringify(clinic));
                });

                customClinic.push(clinic);
            });

            return Observable.of(customClinic);
        });
    }

    private pushClinicContact(clinicContacts, data, isProfileContacts) {
        clinicContacts.push({
            id: data.id,
            clinicId: data.clinicId,
            contactType: data.contactType,
            contact: data.contact,
            isProfileContacts: isProfileContacts
        })
    }

    private pushClinicSchedule(clinicSchedules, data) {
        const schedule = clinicSchedules.filter(clinicSchedule => { return clinicSchedule.dayOfWeek === data.dayOfWeek });
        if (schedule.length === 0) {
            clinicSchedules.push(
                {
                    id: data.id,
                    clinicId: data.clinicId,
                    dayOfWeek: data.dayOfWeek,
                    timeSlot: [{
                        startTime: data.startTime,
                        endTime: data.endTime
                    }]
                }
            );
        } else {
            schedule[0].timeSlot.push({
                startTime: data.startTime,
                endTime: data.endTime
            });

            schedule[0].timeSlot.sort(function (a, b) {
                return new Date('1970/01/01 ' + a.startTime).getTime() - new Date('1970/01/01 ' + b.startTime).getTime();
            });

            clinicSchedules.filter(clinicSchedule => { return clinicSchedule.dayOfWeek === data.dayOfWeek })[0] = schedule[0];
        }
    }


    public getClinicRecordByUserId() {
        return this.http.get(CONFIG.API.getClinicRecordByUserId, [this.getUserId()]);
    }

    public updateClinicDetailRecord(clinic) {
        return this.http.put(CONFIG.API.clinicDetailRecord, clinic);
    }

    public deleteClinicDetailRecord(clinicId) {
        return this.http.delete(CONFIG.API.clinicDetailRecord, [clinicId]);
    }

    public getClinicTimeSlotByClinicId(clinicId) {
        return this.http.get(CONFIG.API.getClinicTimeSlotByClinicId, [clinicId]);
    }

    public getClinicContactByClinicId(clinicId) {
        return this.http.get(CONFIG.API.getClinicContactByClinicId, [clinicId]);
    }
}