import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, NavParams } from 'ionic-angular';

import { RootNavController } from '../../services';
import { PatientManagerService } from './patient-manager.service';

@Component({
    selector: 'patient-manager-page',
    templateUrl: 'patient-manager.html',
    providers: [PatientManagerService]
})
export class PatientManagerPage implements OnInit {

    private loading: any;
    private patiendId: any;

    constructor(
        private formBuilder: FormBuilder,
        private loadingController: LoadingController,
        private modalController: ModalController,
        private params: NavParams,
        private rootNav: RootNavController,
        private patientManagerService: PatientManagerService) {
        this.getDefaults();
    }

    private getDefaults() {
        this.patiendId = this.params.get('patiendId') ? this.params.get('patiendId') : null;
    }

    public ngOnInit() {
    }

    public sharePatient() {
        // this.rootNav.push()
    }
}
