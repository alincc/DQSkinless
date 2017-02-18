import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BlankPage } from '../blank/blank.page';
import { ProfileForm } from './form/profile.form';
import { AssistantManagerForm } from '../assistant-manager/assistant-manager.form';
@Component({
	selector: 'profile-page',
	templateUrl: 'profile.html'
})
export class ProfilePage{
	blank: any = BlankPage;
	public form: any = ProfileForm;
	public assistant: any = AssistantManagerForm;
	
	constructor(public nav: NavController){}
}