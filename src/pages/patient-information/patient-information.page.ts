import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { RootNavController } from '../../services';

@Component({
  selector: 'page-patient-information',
  templateUrl: 'patient-information.html',
})
export class PatientInformationPage {
 

  public patientId;
  private hasPatientId;

  constructor( 
    private navParams: NavParams,
    private rootNav: RootNavController
    ) {
      this.patientId = navParams.data;

        this.hasPatientId = !isNaN(this.patientId);
  }

  

  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientInformation');
  }

	public submit(response) {
		this.rootNav.pop();
	}

}
