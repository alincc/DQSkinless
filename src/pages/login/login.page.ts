import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ManagerPage } from '../manager/manager.page';
import { RegistrationPage } from '../registration/registration.page';

@Component({
	selector: 'login-page',
	templateUrl: 'login.html'
})
export class LoginPage {

	constructor(private nav: NavController) { }

	public login() {
		// FOR TESTING
		const isLoggedAsDoctor = true;
		const isRegistered = false;

		this.nav.setRoot(isRegistered ? ManagerPage : RegistrationPage, { isLoggedAsDoctor: isLoggedAsDoctor });
	}
}