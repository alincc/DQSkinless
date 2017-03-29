import { Component } from '@angular/core';
import { NavParams } from "ionic-angular";

@Component({
	selector: 'clinic-page',
	templateUrl: 'clinic.html'
})
export class ClinicPage {

	constructor(private params: NavParams) {
		if (this.params.data) {
			params.data.parent.step = 4;			
			this.params.data.parent.completedRegistration = true; //TEMP
		}
	}
}