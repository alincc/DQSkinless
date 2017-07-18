import { Component, EventEmitter } from '@angular/core';
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
	public gender = LOVS.GENDER;
	public legal = LOVS.LEGAL_STATUS;

	private patient: any;
	private patientId: any;

	constructor(private rootNav: RootNavController,
		private service: PatientProfileService,
		private navParams: NavParams) {
		this.timeline = timeline;
		this.patientId = navParams.get('patientId');
		this.fetchPatientInformation(this.patientId);
	}

	ionViewCanLeave() {
		const patientListCallback = this.navParams.get('patientListCallback');
		if (patientListCallback) {
			patientListCallback(true).then(() => {
				return true;
			});
		}
	}

	private fetchPatientInformation(patientId) {
		this.service.getPatientDetails(patientId).subscribe(response => {
			if (response.status) {
				this.patient = response.result;
			}
		})
	}

	public gotoEditPatient() {
		let callback = new EventEmitter<any>();
		this.rootNav.push(
			PatientInformationPage,
			{
				patientId: this.patientId,
				mode: MODE.edit,
				callback: callback
			});
		callback.subscribe(response => {
			if (this.navParams.data) {
				this.fetchPatientInformation(response.patientId);
			}
		})
	}

	public open() {
		this.rootNav.push(ConsultationFormPage);
	}
}
