import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { RootNavController } from '../../services/services';

@Component({
	selector: "change-password-page",
	templateUrl: "change-password.html"
})
export class ChangePasswordPage {

	constructor(
		private alertController: AlertController,
		private rootNav: RootNavController) { }

	public changePassword(changePasswordFormValue) {
		this.alertController.create({
			message: `You have successfully changed your password!`,
			buttons: [
				{
					text: 'OK',
					handler: () => {
						this.rootNav.pop();
					}
				}
			]
		}).present();
	}
}
