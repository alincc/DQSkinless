import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { ManagerPage } from '../manager/manager.page';

import { RegistrationPage } from '../registration/registration.page';
import { LoginService } from './login.service';

import { XHRButton } from '../../components/xhr-button/xhr-button.component';

import { RootNavController } from '../../services/services';

@Component({
	selector: 'login-page',
	templateUrl: 'login.html',
	providers: [LoginService]
})
export class LoginPage {
	private username: string;
	private password: string;

	@ViewChild(XHRButton) submit: XHRButton;

	constructor(
		private alert: AlertController,
		private nav: NavController,
		private rootNav: RootNavController,
		private service: LoginService) {
		this.rootNav.setRootNav(this.nav);
	}

	public login() {
		this.service.authenticate(this.username, this.password)
			.subscribe(response => {
				if (response.status) {
					switch (response.result.principal.status) {
						case 5:
							this.rootNav.setRoot(ManagerPage);
							break;
						case 0:
							this.alert.create({
								message: "Account is inactive. Please Contact System Administrator",
								buttons: ['Dismiss']
							}).present;
						default:
							this.rootNav.push(RegistrationPage, { step: response.result.principal.status, role: response.result.principal.role });
							break;
					}
				}
				this.submit.dismissLoading();
			}, err => {
				this.submit.dismissLoading();
			});
	}


}