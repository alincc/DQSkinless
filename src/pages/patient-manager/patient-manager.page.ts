import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, NavParams } from 'ionic-angular';

import { RootNavController } from '../../services';
import { PatientManagerService } from './patient-manager.service';

import { CollaboratedPage } from './collaborated/collaborated.page'
import { SharedPage } from './shared/shared.page';
import { TransferredPage } from './transferred/transferred.page';

@Component({
    selector: 'patient-manager-page',
    templateUrl: 'patient-manager.html',
    providers: [PatientManagerService]
})
export class PatientManagerPage implements OnInit {

    public collaborated = CollaboratedPage;
    public shared = SharedPage;
    public transferred = TransferredPage;

    private loading: any;
    private patiendId: any;

    public patient = {
        patiendId: this.patiendId
    };

    constructor(
        private formBuilder: FormBuilder,
        private loadingController: LoadingController,
        private modalController: ModalController,
        private params: NavParams,
        private rootNav: RootNavController,
        private patientManagerService: PatientManagerService) {
        this.patiendId = this.params.get('patiendId') ? this.params.get('patiendId') : null;
    }

    public ngOnInit() {
    }
}
