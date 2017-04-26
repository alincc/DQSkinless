import { Component } from '@angular/core';
import { TabsPage } from '../tabs/tabs';
import { App } from 'ionic-angular';
import { ManagerService } from './manager.service';
import { RootNavController } from '../../services/services';

@Component({
	selector: 'manager-page',
	templateUrl: 'manager.html',
	providers: [ManagerService]
})
export class ManagerPage {

	private clinicList: any[];

	constructor(private app: App,
		private service: ManagerService,
		private root: RootNavController) {

		service.getClinicRecordByUserId().subscribe(response => {
			if (response && response.status) {
				this.clinicList = response.result;
			}
		});
	}

	go(item) {
		this.root.loadInit(item.clinicId);
		this.app.getRootNav().setRoot(TabsPage);
	}
}	