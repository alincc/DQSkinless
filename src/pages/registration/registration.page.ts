import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ChangePasswordForm } from '../change-password/form/change-password.form';

@Component({
	selector: 'registration-page',
	templateUrl: 'registration.html'
})
export class RegistrationPage{
	public root: any;
	public params: any;
	public step: number;
	constructor(private nav: NavController){
		this.root = ChangePasswordForm;
		this.params = {
			parentNav: nav,
			parent: this
		};
	}


}