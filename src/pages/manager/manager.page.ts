import { Component, OnInit } from '@angular/core';
import { App, AlertController } from 'ionic-angular';

import { LoginPage } from '../login/login.page';
import { TabsPage } from '../tabs/tabs';

import { ManagerService } from './manager.service';
import { RootNavController, Storage } from '../../services/services';

@Component({
	selector: 'manager-page',
	templateUrl: 'manager.html',
	providers: [ManagerService]
})
export class ManagerPage implements OnInit {

	private clinics: any[];

	constructor(
		private app: App,
		private alertController: AlertController,
		private managerService: ManagerService,
		private root: RootNavController,
		private storage: Storage) {
		this.clinics = [];
	}

	public ngOnInit() {
		this.managerService.getClinicRecordByUserId().subscribe(response => {
			if (response && response.status) {
				this.clinics = response.result;
			}
		});
	}

	public go(clinic) {
		this.root.loadInit(clinic.clinicId);
		this.app.getRootNav().setRoot(TabsPage);
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