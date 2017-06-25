import { Component } from '@angular/core';

import { RootNavController } from '../../services';

import { PatientInformationPage } from '../../pages/patient-information/patient-information.page';

@Component({
	selector: 'patient-page',
	templateUrl: 'patient.html'
})
export class PatientPage {

	constructor(private rootNav: RootNavController) { }

	private goToAdd() {
		this.rootNav.push(PatientInformationPage);
	}
}