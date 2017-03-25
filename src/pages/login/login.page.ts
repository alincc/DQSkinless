import { Component, EventEmitter } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { ManagerPage } from '../manager/manager.page';

import { RegistrationPage } from '../registration/registration.page';
import { LoginService } from './login.service';
@Component({
	selector: 'login-page',
	templateUrl: 'login.html',
	providers: [LoginService]
})
export class LoginPage {
	private username: string;
	private password: string;
	private form:any;
	private submitObservable: any;
	private submitEmitter: any;

	constructor(private nav: NavController,
		private service: LoginService,
		private alert: AlertController) {

		this.submitObservable  = this.service.authenticate;
		this.submitEmitter = new EventEmitter();
	}

	public login() {
		this.submitEmitter.emit();
	}

	public onSuccess(response){
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
	}



}