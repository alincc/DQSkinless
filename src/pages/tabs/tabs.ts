import { Component } from '@angular/core';
import { App, AlertController, NavController } from 'ionic-angular';

import { SchedulePage } from '../schedule/schedule.page';
import { PatientPage } from '../patient/patient.page';
import { ChatPage } from '../chat/chat.page';
import { LoginPage } from '../login/login.page';
import { ManagerPage } from '../manager/manager.page';
import { NotificationPage } from '../notification/notification.page';
import { ProfilePage } from '../profile/profile.page';
import { ClinicManagerPage } from '../clinic-manager/clinic-manager.page';

import { RootNavController, Storage, Images } from '../../services/services';

@Component({
	selector: 'tabs',
	templateUrl: 'tabs.html'
})
export class TabsPage {
	notification: any = NotificationPage;
	schedule: any = SchedulePage;
	patient: any = PatientPage;
	chat: any = ChatPage;

	private profilepic: string;
	private userDetails: any;
	private account: any;
	root: NavController;
	constructor(
		private app: App,
		private alertController: AlertController,
		private nav: NavController,
		private rootNav: RootNavController,
		private storage: Storage,
		private images: Images) {
		this.root = app.getRootNav();
		this.rootNav.setRootNav(this.nav);
		
		storage.userDetailsSubject.subscribe(userDetails => {
			this.userDetails = userDetails;
		});
		storage.accountSubject.subscribe(account => {
			this.account = account;			
			this.images.getImage( this.account.userId + "_profile_pic.jpg").then(response => {
				this.profilepic = response;
			})
		})
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

	public openManager() {
		this.rootNav.push(ManagerPage);
	}

	public openClinicManager() {
		this.rootNav.push(ClinicManagerPage, { isManager: true });
	}

	public openProfile() {
		this.rootNav.push(ProfilePage, {
			formType: this.storage.userDetails.role === 1 ? 'D' : 'ND'
		});
	}
}
