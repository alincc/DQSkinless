import { Component, OnInit } from '@angular/core';
import { App, LoadingController, AlertController } from 'ionic-angular';

import { LoginPage } from '../login/login.page';
import { TabsPage } from '../tabs/tabs';

import { ManagerService } from './manager.service';
import { RootNavController, Storage } from '../../services';

@Component({
	selector: 'manager-page',
	templateUrl: 'manager.html',
	providers: [ManagerService]
})
export class ManagerPage implements OnInit {

	private clinics: any[];
	private loading: any;

	constructor(
		private app: App,
		private alertController: AlertController,
		private loadingController: LoadingController,
		private managerService: ManagerService,
		private root: RootNavController,
		private storage: Storage) {
	}

	public ngOnInit() {
		this.managerService.getClinicRecordByUserId().subscribe(response => {
			if (response && response.status) {
				this.clinics = response.result;
			}else{
				this.clinics = [];
			}
		}, err => console.error(err));
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
		this.showLoading();
		this.managerService.getClinicAcessByUserIdAndClinicId(clinic.clinicId).subscribe(response => {
			if (response && response.status) {
				this.storage.accessRole = { accessRole: response.result.accessRole };
				this.storage.clinic = clinic;
				this.app.getRootNav().setRoot(TabsPage);
			} this.dismissLoading();
		}, err => this.dismissLoading());
	}

	public logout() {
		this.alertController.create({
			message: `Are you sure you want to logout?`,
			buttons: [
				{
					text: 'NO',
					role: 'cancel',
				},
				{
					text: 'YES',
					handler: () => {
						this.storage.clear();
						this.app.getRootNav().setRoot(LoginPage);
					}
				}]
		}).present();
	}
}	