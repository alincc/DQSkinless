import { Component, ViewChild } from '@angular/core';
import { Content, NavController, NavParams } from 'ionic-angular';

import { ManagerPage } from "../manager/manager.page";
import { StepOnePage } from './step-one/step-one.page';
import { StepTwoPage } from './step-two/step-two.page';
import { StepThreePage } from './step-three/step-three.page';
import { StepFourPage } from './step-four/step-four.page';

import { RegistrationService } from './registration.service';

@Component({
	selector: 'registration-page',
	templateUrl: 'registration.html',
	providers: [RegistrationService]
})
export class RegistrationPage {
	@ViewChild(Content) content: Content;

	public root: any;
	public params: any;
	public completedRegistration: boolean;
	public _step: number;
	public _isDoctor: number;

	constructor(
		private nav: NavController,
		private loginParams: NavParams,
		private service : RegistrationService) {

		this.params = {
			parentNav: nav,
			parent: this,
			isLoggedAsDoctor: this.isDoctor()
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

	public isDoctor(){
		if(!this._isDoctor){
			this._isDoctor = this.loginParams.data.role;
		}
		return this._isDoctor === 1;
	}

	public set step(_step: any) {
		// update status
		if(this._step){
			this.service.updateStatus(_step).subscribe();
		}
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