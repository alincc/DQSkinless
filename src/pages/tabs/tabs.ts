import { Component, ViewChild, EventEmitter } from '@angular/core';
import { App, AlertController, NavController, Tabs } from 'ionic-angular';

import { SchedulePage } from '../schedule/schedule.page';
import { PatientPage } from '../patient/patient.page';
import { ChatPage } from '../chat/chat.page';
import { LoginPage } from '../login/login.page';
import { ManagerPage } from '../manager/manager.page';
import { DashboardPage } from '../dashboard/dashboard.page';
import { ProfilePage } from '../profile/profile.page';
import { ClinicManagerPage } from '../clinic-manager/clinic-manager.page';
import { ChangePasswordPage } from '../change-password/change-password.page';

import { RootNavController, Storage, Images,IMG_BUCKET, BASE64_PREFIX } from '../../services';

@Component({
	selector: 'tabs',
	templateUrl: 'tabs.html'
})
export class TabsPage {

	public dashboard: any = DashboardPage;
	public schedule: any = SchedulePage;
	public patient: any = PatientPage;
	public chat: any = ChatPage;

	public root: NavController;

	private profilepic: string;
	private userDetails: any;
	private account: any;
	private clinic: any;
	@ViewChild(Tabs)
	private Tabs: Tabs;
	private addQueueEmitter: EventEmitter<any> = new EventEmitter<any>();
	private params: any = {
		addQueueEmitter : this.addQueueEmitter
	};

	ngAfterViewInit(){
		this.params.tabs = this.Tabs
	}
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
			if (userDetails) {
				this.userDetails = userDetails;
			}
		});

		storage.accountSubject.subscribe(account => {
			if (account) {
				this.account = account;
				//commented due to saving of s3 connection
				this.images.getImageIDsOnFolder(IMG_BUCKET.USER, account.userId).subscribe(response =>{
					if(response.status && response.result && response.result.length>0){
						this.images.getImage({
							bucketName : IMG_BUCKET.USER,
							folderName : account.userId,
							ownerId : account.userId,
							imageId : response.result[0]
						}).then(response => {
							this.profilepic = response;
						});
					}
				})
				
			}
		});

		storage.clinicSubject.subscribe(clinic => {
			if (clinic) {
				this.clinic = clinic;
			}
		});
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
			formType: this.account.role === 1 ? 'D' : 'ND'
		});
	}

	public openChangePassword() {
		this.rootNav.push(ChangePasswordPage);
	}
}
