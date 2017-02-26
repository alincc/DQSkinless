import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { timeline } from './timeline.mock';
import { ConsultationFormPage } from '../consultation-form/consultation-form';

@Component({
	selector:'patient-profile-page',
	templateUrl: 'patient-profile.html'
})
export class PatientProfilePage{
	public timeline: any;
	constructor(private nav:NavController){
		this.timeline = timeline;
	}

	open(){
		this.nav.push(ConsultationFormPage);
	}
}