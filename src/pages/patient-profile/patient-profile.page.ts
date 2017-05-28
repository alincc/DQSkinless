import { Component } from '@angular/core';
import { RootNavController } from '../../services';
import { timeline } from './timeline.mock';
import { ConsultationFormPage } from '../consultation-form/consultation-form';
import { PatientManagerPage } from '../patient-manager/patient-manager.page';

@Component({
	selector: 'patient-profile-page',
	templateUrl: 'patient-profile.html'
})
export class PatientProfilePage {
	public timeline: any;
	constructor(private rootNav: RootNavController) {
		this.timeline = timeline;
	}

	open() {
		this.rootNav.push(ConsultationFormPage);
	}

	public share() {
		// TODO pass patient id
		this.rootNav.push(PatientManagerPage, {
			patientId: null,
		});
	}
}