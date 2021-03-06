import { Component } from '@angular/core';
import { NavParams, Tabs } from 'ionic-angular';

import { RootNavController } from '../../services';

import { PatientInformationPage } from '../../pages/patient-information/patient-information.page';

@Component({
	selector: 'patient-page',
	templateUrl: 'patient.html'
})
export class PatientPage {
	constructor(private rootNav: RootNavController,
		private params: NavParams) {
		console.log(params.data);
	}

	private goToAdd() {
		this.rootNav.push(PatientInformationPage);
	}
}