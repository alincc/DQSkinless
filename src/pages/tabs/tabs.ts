import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';

import { SchedulePage } from '../schedule/schedule.page';
import { PatientPage } from '../patient/patient.page';
import { ChatPage } from '../chat/chat.page';
import { LoginPage } from '../login/login.page';
import { ManagerPage } from '../manager/manager.page';
import { NotificationPage } from '../notification/notification.page';
import { ProfilePage } from '../profile/profile.page';
import { AssistantManagerPage } from '../assistant-manager/assistant-manager.page';
import { ClinicManagerPage } from '../clinic-manager/clinic-manager.page';

import { RootNavController } from '../../services/services';

@Component({
	selector: 'tabs',
	templateUrl: 'tabs.html'
})
export class TabsPage {
	notification: any = NotificationPage;
	schedule: any = SchedulePage;
	patient: any = PatientPage;
	chat: any = ChatPage;

	root: NavController;
	constructor(private app: App,
		private nav: NavController,
		private rootNav: RootNavController) {
		this.root = app.getRootNav();
		this.rootNav.setRootNav(this.nav);
	}

	logout() {
		this.root.setRoot(LoginPage);
	}

	openManager() {
		this.rootNav.push(ManagerPage);
	}

	openAssistantManager() {
		this.rootNav.push(AssistantManagerPage, { isManager: true });
	}

	openClinicManager() {
		this.rootNav.push(ClinicManagerPage, { isManager: true });
	}

	openProfile() {
		this.rootNav.push(ProfilePage);
	}
}
