import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { ManagerPage } from '../manager/manager.page';

import { RegistrationPage } from '../registration/registration.page';
import { LoginService } from './login.service';


import { RootNavController } from '../../services/services';

@Component({
	selector: 'login-page',
	templateUrl: 'login.html',
	providers: [LoginService]
})
export class LoginPage {
	private username: string;
	private password: string;

	constructor(
		private alert: AlertController,
		private nav: NavController,
		private rootNav: RootNavController,
		private service: LoginService) {
		this.rootNav.setRootNav(this.nav);
	}

	public login(event) {
		// this.service.authenticate(this.username, this.password)
		// 	.subscribe(response => {
		// 		if (response.status) {
		// 			switch (response.result.principal.status) {
		// 				case 5:
		// 					this.rootNav.setRoot(ManagerPage);
		// 					break;
		// 				case 0:
		// 					this.alert.create({
		// 						message: "Account is inactive. Please Contact System Administrator",
		// 						buttons: ['Dismiss']
		// 					}).present;
		// 				default:
		// 					this.rootNav.push(RegistrationPage, { step: response.result.principal.status, role: response.result.principal.role });
		// 					break;
		// 			}
		// 		}
		// 		event.dismissLoading();
		// 	}, err => {
		// 		event.dismissLoading();
		// 	});
		this.rootNav.push(RegistrationPage, { step: 4, role: 1 });
		event.dismissLoading();
	}


}