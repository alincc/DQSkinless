import { Component } from '@angular/core';
import { RootNavController } from '../../services';
import { timeline } from './timeline.mock';
import { ConsultationFormPage } from '../consultation-form/consultation-form';
import { PatientManagerPage } from '../patient-manager/patient-manager.page';
import { PatientDoctorRelationshipPage } from '../patient-doctor-relationship/patient-doctor-relationship.page';
import { PatientProfileService } from './patient-profile.service';
import { NavParams } from "ionic-angular";
import { Utilities } from '../../utilities/utilities';

import { PatientInformationPage } from '../../pages/patient-information/patient-information.page';

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
		this.rootNav.push(PatientManagerPage, {
			patientId: this.patientId,
		});
	}

	private fetchPatientInformation(){

		this.service.getPatientDetails(this.patientId).subscribe(response =>{
			if(response.status){
				
				this.patientId = response.result.patientId;
				this.address = response.result.address;
				this.patientName = Utilities.getFullName(response.result);
				this.address = response.result.address;
				this.age = response.result.birthDate != null ? Utilities.getAge(response.result.birthDate) : "unknown";
				this.registrationDate = response.result.startDate != null ? Utilities.transformDate( new Date(response.result.startDate)) : "unknown";
			}
		})
	}

	private gotoEditPatient(){
		this.rootNav.push(PatientInformationPage, this.patientId);
	}
}