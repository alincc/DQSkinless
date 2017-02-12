import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UploadPhotoForm } from '../upload-photo/upload-photo.form';

@Component({
	selector: 'profile-form',
	templateUrl: 'profile-form.html'
})
export class ProfileForm{
	constructor(private nav: NavController,
		private params:NavParams){

	}

	public submit(){
		this.params.data.parent.step = 3;
		this.nav.push(UploadPhotoForm);
	}
}