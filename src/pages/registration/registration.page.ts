import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StepOnePage } from './step-one/step-one.page';

@Component({
	selector: 'registration-page',
	templateUrl: 'registration.html'
})
export class RegistrationPage {
	public root: any;
	public params: any;
	public step: number;

	constructor(private nav: NavController) {
		this.root = StepOnePage;
		this.params = {
			parentNav: nav,
			parent: this
		};
	}
}
