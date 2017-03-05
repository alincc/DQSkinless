import { Component, ViewChild } from '@angular/core';
import { Content, NavController, NavParams } from 'ionic-angular';

import { ManagerPage } from "../manager/manager.page";
import { StepOnePage } from './step-one/step-one.page';

import { RegistrationData, RegistrationForm } from '../../shared/model/registration.model';

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

		this.root = StepOnePage;
		this.completedRegistration = false;

		this.params = {
			parentNav: nav,
			parent: this,
			isLoggedAsDoctor: this.loginParams.data.isLoggedAsDoctor,
			registrationData: this.initRegistrationData()
		};
	}

	initRegistrationData() {
		const registrationData = new RegistrationData();
		registrationData.user = new RegistrationForm();
		registrationData.assistant = [];
		return registrationData;
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
		console.log('registration data=> ' + JSON.stringify(this.params.registrationData));
		this.nav.setRoot(ManagerPage);
	}
}