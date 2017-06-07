import { Component } from '@angular/core';
import { RootNavController } from '../../services';
import { timeline } from './timeline.mock';
import { ConsultationFormPage } from '../consultation-form/consultation-form';
import { PatientManagerPage } from '../patient-manager/patient-manager.page';
import { PatientDoctorRelationshipPage } from '../patient-doctor-relationship/patient-doctor-relationship.page';
import { PatientProfileService } from './patient-profile.service';
import { NavParams } from "ionic-angular";

@Component({
	selector: 'patient-profile-page',
	templateUrl: 'patient-profile.html',
	providers: [PatientProfileService]
})
export class PatientProfilePage {
	public timeline: any;

	private patientName;
	private registrationDate;
	private contact;
	private age;
	private address;
	private patientId;

	constructor(private rootNav: RootNavController,
				private service: PatientProfileService,
				private navParams: NavParams) {
		this.timeline = timeline;

		this.patientId = navParams.data;
		
		this.fetchPatientInformation();
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

	private fetchPatientInformation(){

		this.service.getPatientDetails(this.patientId).subscribe(response =>{
			if(response.status){
				this.address = response.result.address;
				this.patientName = response.result.lastname;
			}
		})
	}
}