import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BlankPage } from '../blank/blank.page';
import { ProfileForm } from '../../components/profile-form/profile-form';
import { AssistantManagerPage } from '../assistant-manager/assistant-manager.page';

@Component({
	selector: 'profile-page',
	templateUrl: 'profile.html'
})
export class ProfilePage{
	blank: any = BlankPage;
	public form: any = ProfileForm;
	public assistant: any = AssistantManagerPage;
	
	constructor(public nav: NavController){}
}