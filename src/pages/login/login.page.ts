import { Component, EventEmitter, ViewChild } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { ManagerPage } from '../manager/manager.page';

import { RegistrationPage } from '../registration/registration.page';
import { LoginService } from './login.service';
import { XHRButton } from '../../components/xhr-button/xhr-button.component';
@Component({
	selector: 'login-page',
	templateUrl: 'login.html',
	providers: [LoginService]
})
export class LoginPage {
	private username: string;
	private password: string;

	@ViewChild(XHRButton) submit: XHRButton;

	constructor(private nav: NavController,
		private service: LoginService,
		private alert: AlertController) {

	}

	public login() {
		this.service.authenticate(this.username, this.password)
			.subscribe(response => {
				if(response.status){
					switch(response.result.principal.status){
						case 5: 
							this.nav.push(ManagerPage);
							break;
						case 0:
							this.alert.create({
								message: "Account is inactive. Please Contact System Administrator",
								buttons: ['Dismiss']
							}).present;
						default:
							this.nav.push(RegistrationPage, {step : response.result.principal.status, role: response.result.principal.role});
							break;
					}
				}
				this.submit.dismissLoading();
			}, err => {
				this.submit.dismissLoading();
			});
	}


}