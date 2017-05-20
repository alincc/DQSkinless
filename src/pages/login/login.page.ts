import { Component } from '@angular/core';
import { AlertController, ModalController, NavController } from 'ionic-angular';
import { ManagerPage } from '../manager/manager.page';
import { ForgotPasswordModal } from '../../components/forgot-password-modal/forgot-password-modal.component';

import { RegistrationPage } from '../registration/registration.page';
import { LoginService } from './login.service';

import { RootNavController } from '../../services';

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
		private modalController: ModalController,
		private nav: NavController,
		private rootNav: RootNavController,
		private service: LoginService) {
		this.rootNav.setRootNav(this.nav);
	}

	public login(event) {
		this.service.authenticate(this.username, this.password)
			.subscribe(response => {
				if (response.status) {
					switch (response.result.principal.status) {
						case 5:
							this.rootNav.push(ManagerPage);
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
				event.dismissLoading();
			}, err => event.dismissLoading());
	}

	public forgotPassword(event) {
		event.preventDefault();

		let forgotPasswordModal = this.modalController.create(ForgotPasswordModal);
		forgotPasswordModal.present();
	}
}