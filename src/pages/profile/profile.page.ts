import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BlankPage } from '../blank/blank.page';
import { ProfileForm } from '../../components/profile-form/profile-form.component';

@Component({
	selector: 'profile-page',
	templateUrl: 'profile.html'
})
export class ProfilePage {
	blank: any = BlankPage;
	public form: any = ProfileForm;

	constructor(public nav: NavController) { }
}