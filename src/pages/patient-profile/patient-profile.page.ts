import { Component } from '@angular/core';
import { RootNavController } from '../../services';
import { timeline } from './timeline.mock';
import { ConsultationFormPage } from '../consultation-form/consultation-form';
import { PatientProfileService } from './patient-profile.service';
import { NavParams } from "ionic-angular";
import { Utilities } from '../../utilities/utilities';
import { MODE, LOVS } from '../../constants/constants';

import { PatientInformationPage } from '../../pages/patient-information/patient-information.page';

@Component({
	selector: 'patient-profile-page',
	templateUrl: 'patient-profile.html',
	providers: [PatientProfileService]
})
export class PatientProfilePage {
	public timeline: any;

	private patientId;
	private patient : any;

	private gender = LOVS.GENDER;
	private legal = LOVS.LEGAL_STATUS;

	constructor(private rootNav: RootNavController,
		private service: PatientProfileService,
		private navParams: NavParams) {
		this.timeline = timeline;

		this.patientId = navParams.data;
		this.fetchPatientInformation(this.patientId);
	}

	open() {
		this.rootNav.push(ConsultationFormPage);
	}

	private fetchPatientInformation(patientId) {

		this.service.getPatientDetails(patientId).subscribe(response =>{
			if(response.status){
				this.patient = response.result;
			}
		})
	}

	private gotoEditPatient(){
		this.rootNav.push(
			PatientInformationPage, 
			{
				patientId: this.patientId, 
				mode: MODE.edit,
				callback: this.patientProfileCallback});
	}

	public patientProfileCallback = (navParams) => {
		return new Promise((resolve, reject) => {
			if (this.navParams.data) {
				this.fetchPatientInformation(this.navParams.data);
			}

			resolve();
		});
	}
}