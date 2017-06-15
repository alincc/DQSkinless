import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { RootNavController } from '../../services';

@Component({
  selector: 'page-patient-information',
  templateUrl: 'patient-information.html',
})
export class PatientInformationPage {
 

  private hasPatientId;

  constructor( 
    private navParams: NavParams,
    private rootNav: RootNavController,
    private nav : NavController
    ) {

        this.hasPatientId = navParams.get('patientId');
  }

  

  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientInformation');
  }

	public submit(response) {
		// this.rootNav.pop();
    this.nav.pop();
    this.navParams.data.addOrEditQueue(response);
	}

}
