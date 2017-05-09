import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
	selector: 'profile-page',
	templateUrl: 'profile.html'
})
export class ProfilePage {

	public formType;

	constructor(private params: NavParams) {
		this.formType = this.params.data && this.params.data.formType ? this.params.data.formType : 'ND';
	}

	public submit(response) {

	}
}