import { Component } from '@angular/core';
import { App,NavController } from 'ionic-angular';

import { SchedulePage } from '../schedule/schedule.page';
import { PatientPage } from '../patient/patient.page';
import { ChatPage } from '../chat/chat.page';
import { LoginPage } from '../login/login.page';
import { ManagerPage } from '../manager/manager.page';
import { NotificationPage } from '../notification/notification.page';

@Component({
	templateUrl: 'tabs.html'
})
export class TabsPage {
	notification: any = NotificationPage;
	schedule: any = SchedulePage;
	patient: any = PatientPage;
	chat: any = ChatPage;

	root: NavController;
	constructor(private app : App,
		private nav: NavController) {
		this.root = app.getRootNav();
	}

	logout(){
		this.root.setRoot(LoginPage);
	}

	openManager(){
		this.nav.push(ManagerPage);
	}


}
