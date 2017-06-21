import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';

import { HttpService, Storage } from '../../services';
import { CONFIG } from '../../config/config';

@Injectable()
export class ClinicManagerService {

    constructor(
        private http: HttpService,
        private storage: Storage) { }

    private userId;

    public getUserId() {
        if (!this.userId) {
            this.storage.accountSubject.subscribe(account => {
                if (account) {
                    this.userId = account.userId;
                }
            });
        }
        return this.userId;
    }

    public getNoOfClinics() {
        return this.http.get(CONFIG.API.getNoOfClinics, [this.getUserId()]);
    }

    public createClinic(clinic) {
        clinic.userId = this.getUserId();
        return this.http.post(CONFIG.API.customClinic, clinic);
    }

    public deleteClinic(clinicId) {
        return this.http.delete(CONFIG.API.customClinic, [clinicId]);
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
                    this.getClinicContactByClinicId(clinic.clinicId)
                ]).map((data: any[]) => {
                    clinic.schedules = [];
                    clinic.contacts = [];

                    const clinicSchedules = data[0]
                    const clinicContacts = data[1];

                    if (clinicSchedules && clinicSchedules.status) {
                        clinicSchedules.result.forEach(clinicSchedule => {
                            this.pushClinicSchedule(clinic.schedules, clinicSchedule);
                        });
                    }

                    if (clinicContacts && clinicContacts.status) {
                        clinicContacts.result.forEach(clinicContact => {
                            this.pushClinicContact(clinic.contacts, clinicContact);
                        });
                    }

                    return clinic;

                }).subscribe();

                customClinic.push(clinic);
            });

            return Observable.of(customClinic);
        }).flatMap(customClinic => {

            customClinic.forEach(c => {
                this.getClinicAcessByUserIdAndClinicId(c.clinicId).subscribe(response => {
                    if (response && response.status) {
                        c.accessRole = response.result.accessRole;
                    }
                });
            });

            return Observable.of(customClinic);
        });
    }

    private pushClinicContact(clinicContacts, data) {
        clinicContacts.push({
            id: data.id,
            clinicId: data.clinicId,
            contactType: data.contactType,
            contact: data.contact
        })
    }

    private pushClinicSchedule(clinicSchedules, data) {
        const schedule = clinicSchedules.filter(clinicSchedule => clinicSchedule.dayOfWeek === data.dayOfWeek);
        if (schedule.length === 0) {
            clinicSchedules.push(
                {
                    clinicId: data.clinicId,
                    dayOfWeek: data.dayOfWeek,
                    timeSlot: [{
                        id: data.id,
                        startTime: data.startTime,
                        endTime: data.endTime
                    }]
                }
            );
        } else {
            schedule[0].timeSlot.push({
                id: data.id,
                startTime: data.startTime,
                endTime: data.endTime
            });

            schedule[0].timeSlot.sort(function (a, b) {
                return new Date('1970/01/01 ' + a.startTime).getTime() - new Date('1970/01/01 ' + b.startTime).getTime();
            });

            clinicSchedules.filter(clinicSchedule => clinicSchedule.dayOfWeek === data.dayOfWeek)[0] = schedule[0];
        }
    }


    public getClinicRecordByUserId() {
        return this.http.get(CONFIG.API.getClinicRecordByUserId, [this.getUserId()]);
    }

    public updateClinicDetailRecord(clinic) {
        return this.http.put(CONFIG.API.clinicDetailRecord, clinic);
    }

    public getClinicTimeSlotByClinicId(clinicId) {
        return this.http.get(CONFIG.API.getClinicTimeSlotByClinicId, [clinicId]);
    }

    public getClinicContactByClinicId(clinicId) {
        return this.http.get(CONFIG.API.getClinicContactByClinicId, [clinicId]);
    }

    public createClinicTimeslot(clinicTimeSlot) {
        return this.http.post(CONFIG.API.clinicTimeSlots, clinicTimeSlot);
    }

    public deleteClinicTimeslot(clinicTimeSlotId) {
        return this.http.delete(CONFIG.API.clinicTimeSlots, [clinicTimeSlotId]);
    }

    public delTimeSlotsByClinIdAndDayOfWeek(clinicId, dayOfWeek) {
        const params = `/cid/${clinicId}/dow/${dayOfWeek}`;
        return this.http.delete(CONFIG.API.clinicTimeSlots + params);
    }

    public createClinicContact(clinicContact) {
        return this.http.post(CONFIG.API.clinicContacts, clinicContact);
    }

    public deleteClinicContact(clinicContactId) {
        return this.http.delete(CONFIG.API.clinicContacts, [clinicContactId]);
    }

    public createClinicAccessRecord(clinidId, userId, accessRole, userRole) {
        const payload = {
            clinidId: clinidId,
            userId: userId,
            accessRole: accessRole,
            userRole: userRole
        };

        return this.http.post(CONFIG.API.clinicAccess, payload);
    }

    public associateMember(clinicId, userId, accessRole, userRole) {
        const payload = {
            clinicId: clinicId,
            userId: userId,
            accessRole: accessRole,
            userRole: userRole
        };

        return this.http.post(CONFIG.API.clinicAccess, payload);
    }

    public getClinicMember(clinicId) {
        return this.http.get(CONFIG.API.getClinicMember, [clinicId]);
    }

    public deleteClinicAccessByClinIdUserId(clinicId, userId) {
        const param = `/u/${userId}/c/${clinicId}`;
        return this.http.delete(CONFIG.API.clinicAccess + param);
    }

    public getClinicAccessByUserId() {
        return this.http.get(CONFIG.API.getClinicAccessByUserId, [this.getUserId()]);
    }

    public getClinicAcessByUserIdAndClinicId(clinciId) {
        return this.http.get(CONFIG.API.clinicAccess, [`u/${this.getUserId()}`, `c/${clinciId}`]);
    }

    public verifyAffiliateCode(affiliateName, affiliateCode) {
        if (affiliateName && affiliateCode) {
            const payload = {
                affiliateName: affiliateName.toUpperCase(),
                affiliateCode: affiliateCode.toUpperCase()
            };

            return this.http.post(CONFIG.API.verifyAffiliateCode, payload);
        } else {
            return Observable.of({
                result: null,
                status: 1
            });
        }
    }
}