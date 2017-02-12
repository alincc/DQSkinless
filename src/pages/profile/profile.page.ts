import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BlankPage } from '../blank/blank.page';

@Component({
	selector: 'profile-page',
	templateUrl: 'profile.html'
})
export class ProfilePage{
	blank: any = BlankPage;
	
	constructor(public nav: NavController){}
}