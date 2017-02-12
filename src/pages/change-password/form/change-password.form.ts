import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BlankPage } from '../../blank/blank.page';
import { ProfileForm } from '../../profile/form/profile.form';

@Component({
	selector: 'change-password-form',
	templateUrl: 'change-password-form.html'
})
export class ChangePasswordForm{

	@Input()
	private parentNav: NavController;

	constructor(private nav:NavController,
		private params: NavParams){
		if(!this.parentNav && params.data){
			this.parentNav = params.data.parentNav;
			params.data.parent.step = 1;
		}
	}

	public change(){
		if(this.params.data){
			this.params.data.parent.step = 2;
			this.nav.setRoot(ProfileForm,this.params.data,{ animate: true, direction: 'forward'});
		}
	}
}

