import { Component, OnInit } from '@angular/core';
import { Loading, LoadingController, ModalController } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { RootNavController } from '../../services/root-nav-controller';

import { PatientListService } from './patient-list.service';
import { ScheduleService } from '../../pages/schedule/schedule.service';

import { AddQueueFormModal } from '../add-queue-form-modal/add-queue-form.modal.component';
import { PatientProfilePage } from '../../pages/patient-profile/patient-profile.page';

import { Storage } from '../../services';
import { Utilities } from '../../utilities/utilities'

@Component({
    selector: 'patient-list',
    templateUrl: 'patient-list.html',
    providers: [PatientListService, ScheduleService]
})
export class PatientList implements OnInit {

    public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public patients: any;
    public hasValidInput: boolean;
    public name: string;

    private currentPage: any;
    private previousPage: any;
    private oldPatients: any;
    private limit: any;
    private seachPatientSubs: Subscription;

    constructor(
        private loadingController: LoadingController,
        private modalController: ModalController,
        private rootNav: RootNavController,
        private patientListService: PatientListService,
        private scheduleService: ScheduleService,
        private storage: Storage) {
        this.getDefaults();
    }

    private getDefaults() {
        this.limit = 20;
        this.resetPatientTabVariables();
    }

    private resetPatientTabVariables() {
        this.name = '';
        this.hasValidInput = false;
        this.patients = [];
        this.oldPatients = [];

        this.previousPage = 0;
        this.currentPage = 1;
    }

    public ngOnInit() {
        this.storage.patientOwnerSubject.subscribe(patientOwnerSubject => {
            this.name = '';
            this.hasValidInput = false;
            this.patients = [];
            this.oldPatients = [];
        });
    }

    public getFullName(patient) {
        return Utilities.getFullName(patient);
    }

    public getDefaultAvatar(patient) {
        return Utilities.getDefaultAvatar(patient);
    }

    private incrementPage(response) {
        this.previousPage = this.currentPage;
        if (response.result && response.result.length > 0 && response.result.length === this.limit) {
            this.currentPage++;
            this.oldPatients = Object.assign([], this.patients);
        }
    }

    private checkResult(result) {
        return result ? result : [];
    }

    public search(event) {
        this.hasValidInput = this.name && this.name.length >= 2;
        this.previousPage = 0;
        this.currentPage = 1;
        this.oldPatients = [];

        if (this.seachPatientSubs) {
            this.seachPatientSubs.unsubscribe();
        }

        if (this.hasValidInput) {
            this.isLoading.next(true);
            this.seachPatientSubs = this.patientListService.seachPatient(Utilities.formatName(this.name), this.currentPage, this.limit).subscribe(response => {
                if (response && response.status) {
                    this.patients = this.checkResult(response.result);
                    this.incrementPage(response);
                } else {
                    this.patients = [];
                }
                this.isLoading.next(false);
            }, err => this.isLoading.next(false));
        } else {
            this.patients = [];
        }
    }

    public doInfiniteSearch(infiniteScroll) {
        this.patientListService.seachPatient(Utilities.formatName(this.name), this.currentPage, this.limit).subscribe(response => {
            if (response && response.status) {
                if (this.currentPage === 1) {
                    this.patients = this.checkResult(response.result);
                } else if (this.currentPage === this.previousPage) {
                    this.patients = this.oldPatients.concat(this.checkResult(response.result));
                } else {
                    this.patients = this.patients.concat(this.checkResult(response.result));
                }
                this.incrementPage(response);
            }
            infiniteScroll.complete();
        }, err => infiniteScroll.complete());
    }

    public queue(patient) {
        // TODO
    }

    public patientListCallback = (params) => {
        return new Promise((resolve, reject) => {
            for (let i = 1; i <= this.currentPage; i++) {
                this.isLoading.next(true);
                this.patientListService.seachPatient(Utilities.formatName(this.name), i, this.limit).subscribe(response => {
                    if (response && response.status) {
                        if (i === 1) {
                            this.patients = response.result;
                        } else {
                            this.patients = this.patients.concat(response.result);
                        }
                        this.incrementPage(response);
                    }
                    this.isLoading.next(false);
                }, err => this.isLoading.next(false));
            }
            resolve();
        });
    }

    public view(patient) {
        this.rootNav.push(PatientProfilePage, {
            patientId: patient.patientId,
            patientListCallback: this.patientListCallback
        });
    }
}
