import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { RootNavController } from '../../services';
import { PatientInformationPage } from '../../pages/patient-information/patient-information.page';

@Component({
	selector: 'patient-page',
	templateUrl: 'patient.html'
})
export class PatientPage{
	public formType;

	constructor(
		private params: NavParams,
		private rootNav: RootNavController) {
		this.formType = this.params.data && this.params.data.formType ? this.params.data.formType : 'ND';
	}

	public submit(response) {
		this.rootNav.pop();
	}

	private goToAdd(){
		this.rootNav.push(PatientInformationPage);
	}
}