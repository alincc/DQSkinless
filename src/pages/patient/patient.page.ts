import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { PatientService } from './patient.service';
import { RootNavController } from '../../services';

import { PatientInformationPage } from '../../pages/patient-information/patient-information.page';

@Component({
	selector: 'patient-page',
	templateUrl: 'patient.html',
	providers: [PatientService]
})
export class PatientPage implements OnInit {

	public formType;
	public patientList: any;

	public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	constructor(
		private params: NavParams,
		private patientService: PatientService,
		private rootNav: RootNavController) {
		this.patientList = [];
	}

	public ngOnInit() {
		this.isLoading.next(true);
		this.patientService.getPatients().subscribe(response => {
			if (response && response.status) {
				console.log(response);
			}
			this.isLoading.next(false)
		}, err => this.isLoading.next(false));
	}

	private goToAdd() {
		this.rootNav.push(PatientInformationPage);
	}
}