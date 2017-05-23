import { Component } from '@angular/core';
import { RootNavController } from '../../services';
import { timeline } from './timeline.mock';
import { ConsultationFormPage } from '../consultation-form/consultation-form';
import { PatientDoctorRelationshipPage } from '../patient-doctor-relationship/patient-doctor-relationship.page';

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
		this.rootNav.push(PatientDoctorRelationshipPage, {
			pageHeader: 'Share Patient'
		});
	}
}