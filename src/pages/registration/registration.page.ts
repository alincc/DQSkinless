import { Component, ViewChild } from '@angular/core';
import { Content, NavController, NavParams } from 'ionic-angular';

import { ManagerPage } from "../manager/manager.page";
import { StepOnePage } from './step-one/step-one.page';
import { StepTwoPage } from './step-two/step-two.page';
import { StepThreePage } from './step-three/step-three.page';
import { StepFourPage } from './step-four/step-four.page';

@Component({
	selector: 'registration-page',
	templateUrl: 'registration.html'
})
export class RegistrationPage {
	@ViewChild(Content) content: Content;

	public root: any;
	public params: any;
	public completedRegistration: boolean;
	public _step: number;

	constructor(
		private nav: NavController,
		private loginParams: NavParams) {

		this.params = {
			parentNav: nav,
			parent: this,
			isLoggedAsDoctor: this.loginParams.data.role === 1
		};

		switch(loginParams.data.step){
			case 1:
				this.root = StepOnePage;
				break;
			case 2:
				this.root = StepTwoPage;
				break;
			case 3:
				this.root = StepThreePage;
				break;
			case 4:
				this.root = StepFourPage;
		}
		this.completedRegistration = false;
	}

	public set step(_step: any) {
		if (_step == 4) {
			this.content!.resize();
		}
		this._step = _step;
	}

	public get step() {
		return this._step;
	}

	public done() {
		// TODO save registration data
		this.nav.setRoot(ManagerPage);
	}
}