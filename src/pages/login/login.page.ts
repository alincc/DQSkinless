import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ManagerPage } from '../manager/manager.page';

@Component({
	selector: 'login-page',
	templateUrl: 'login.html'
})
export class LoginPage{

	constructor(private nav: NavController){}

	public login(){
		this.nav.push(ManagerPage);
	}
}