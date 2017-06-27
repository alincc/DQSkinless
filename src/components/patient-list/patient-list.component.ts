import { Component } from '@angular/core';
import { Loading, LoadingController, ModalController } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { RootNavController } from '../../services/root-nav-controller';

import { PatientListService } from './patient-list.service';
import { ScheduleService } from '../../pages/schedule/schedule.service';

import { AddQueueFormModal } from '../add-queue-form-modal/add-queue-form.modal.component';
import { PatientProfilePage } from '../../pages/patient-profile/patient-profile.page';

import { QUEUE } from '../../constants/constants'
import { Utilities } from '../../utilities/utilities'

@Component({
    selector: 'patient-list',
    templateUrl: 'patient-list.html',
    providers: [PatientListService, ScheduleService]
})
export class PatientList {

    public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public patients: any;
    public hasValidInput: boolean;
    public name: string;

    private currentPage: any;
    private previousPage: any;
    private oldPatients: any;
    private limit: any;

    constructor(
        private loadingController: LoadingController,
        private modalController: ModalController,
        private rootNav: RootNavController,
        private patientListService: PatientListService,
        private scheduleService: ScheduleService) {
        this.getDefaults();
    }

    private getDefaults() {
        this.currentPage = 1;
        this.previousPage = 0;
        this.limit = 20;
        this.patients = [];
        this.oldPatients = [];
        this.name = '';
        this.hasValidInput = true;
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

    public search(event) {
        this.hasValidInput = this.name && this.name.length >= 2;
        this.previousPage = 0;
        this.currentPage = 1;
        this.oldPatients = [];

        if (this.hasValidInput) {
            setTimeout(function () {
                this.isLoading.next(true);
                this.patientListService.seachPatient(Utilities.formatName(this.name), this.currentPage, this.limit).subscribe(response => {
                    if (response && response.status) {
                        this.patients = response.result;
                        this.incrementPage(response);
                    } else {
                        this.patients = [];
                    }
                    this.isLoading.next(false);
                }, err => this.isLoading.next(false));
            }.bind(this), 2000);
        } else {
            this.patients = [];
        }
    }

    public doInfiniteSearch(infiniteScroll) {
        this.patientListService.seachPatient(Utilities.formatName(this.name), this.currentPage, this.limit).subscribe(response => {
            if (response && response.status) {
                if (this.currentPage === 1) {
                    this.patients = response.result;
                } else if (this.currentPage === this.previousPage) {
                    this.patients = this.oldPatients.concat(response.result);
                } else {
                    this.patients = this.patients.concat(response.result);
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
