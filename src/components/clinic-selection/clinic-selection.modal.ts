import { Component, OnInit } from '@angular/core';
import { App, LoadingController, AlertController, ViewController } from 'ionic-angular';

import { LoginPage } from '../../pages/login/login.page';
import { TabsPage } from '../../pages/tabs/tabs';

import { ClinicSelectionService } from './clinic-selection.service';
import { RootNavController, Storage } from '../../services';

@Component({
    selector: 'clinic-selection',
    templateUrl: 'clinic-selection.html',
    providers: [ClinicSelectionService]
})
export class ClinicSelectionModal implements OnInit {

    private clinics: any[];
    private loading: any;

    constructor(
        private app: App,
        private alertController: AlertController,
        private loadingController: LoadingController,
        private service: ClinicSelectionService,
        private root: RootNavController,
        private storage: Storage,
        private view: ViewController) {
    }

    public ngOnInit() {
        this.showLoading();
        this.service.getClinicRecordByUserId().subscribe(response => {
            if (response && response.status) {
                this.clinics = response.result;
            }
            this.dismissLoading();
        }, err => this.dismissLoading());
    }

    private showLoading() {
        this.loading = this.loadingController.create({
            spinner: 'crescent',
            cssClass: 'xhr-loading'
        });
        this.loading.present();
    }

    private dismissLoading() {
        if (this.loading) {
            this.loading.dismiss();
        }
    }

    public go(clinic) {
        this.storage.clinic = clinic;
        this.view.dismiss();
        this.app.getRootNav().setRoot(TabsPage);
    }

}   