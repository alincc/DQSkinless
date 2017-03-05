import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ManagerPage } from '../manager/manager.page';
import { RegistrationPage } from '../registration/registration.page';

// TO BE REMOVED
import { AssistantManagerPage } from '../assistant-manager/assistant-manager.page';

@Component({
	selector: 'login-page',
	templateUrl: 'login.html'
})
export class LoginPage{

	constructor(private nav: NavController){}

	public login(){
		this.nav.setRoot(RegistrationPage);
	}
}