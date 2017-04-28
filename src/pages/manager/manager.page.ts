import { Component } from '@angular/core';
import { App } from 'ionic-angular';

import { LoginPage } from '../login/login.page';
import { TabsPage } from '../tabs/tabs';

import { ManagerService } from './manager.service';
import { RootNavController, Storage } from '../../services/services';

@Component({
	selector: 'manager-page',
	templateUrl: 'manager.html',
	providers: [ManagerService]
})
export class ManagerPage {

	private clinicList: any[];

	constructor(private app: App,
		private service: ManagerService,
		private root: RootNavController,
		private storage: Storage) {

		service.getClinicRecordByUserId().subscribe(response => {
			if (response && response.status) {
				this.clinicList = response.result;
			}
		});
	}

	public go(item) {
		this.root.loadInit(item.clinicId);
		this.app.getRootNav().setRoot(TabsPage);
	}

	public logout() {
		this.storage.clear();
		this.root.setRoot(LoginPage);
	}
}	