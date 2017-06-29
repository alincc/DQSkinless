import { Component, OnInit } from '@angular/core';
import { App, LoadingController, AlertController } from 'ionic-angular';

import { LoginPage } from '../login/login.page';
import { TabsPage } from '../tabs/tabs';

import { ManagerService } from './manager.service';
import { RootNavController, Storage } from '../../services';
import { StackedServices } from '../../utilities/utilities';

@Component({
	selector: 'manager-page',
	templateUrl: 'manager.html',
	providers: [ManagerService]
})
export class ManagerPage implements OnInit {

	private clinics: any[];
	private loading: any;

	private stack: StackedServices;

	constructor(
		private app: App,
		private alertController: AlertController,
		private loadingController: LoadingController,
		private managerService: ManagerService,
		private root: RootNavController,
		private storage: Storage) {
		this.stack = new StackedServices([]);
	}

	public ngOnInit() {
		this.managerService.getClinicRecordByUserId().subscribe(response => {
			if (response && response.status) {
				this.clinics = response.result;
			} else {
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
		this.stack.clearStack();
		this.stack.push(this.managerService.getClinicAcessByUserIdAndClinicId(clinic.clinicId));
		if (!clinic.affiliateId) {
			this.stack.push(this.managerService.getClinicOwner(clinic.clinicId));
		}

		this.stack.executeFork().subscribe(response => {
			if (response) {
				const clinicAccessResponse = response[0];
				const clinicOwnerResponse = response[1];

				this.storage.clinic = clinic;

				if (clinicAccessResponse && clinicAccessResponse.status) {
					this.storage.accessRole = { accessRole: clinicAccessResponse.result.accessRole };
				}

				if (clinicOwnerResponse && clinicOwnerResponse.status) {
					this.storage.patientOwner = clinicOwnerResponse.result;
				} else {
					this.storage.patientOwner = clinic.affiliateId;
				}

				let nav = this.app.getRootNav();
				if(nav.getByIndex(0).name === "TabsPage"){
					nav.pop();
				}else{
					nav.setRoot(TabsPage);
				}
			}
			this.dismissLoading();
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