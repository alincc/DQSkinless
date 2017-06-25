import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';

import { PatientInformationService } from './patient-information.service';
import { RootNavController } from '../../services';

import { SchedulePage } from '../schedule/schedule.page';

@Component({
  selector: 'page-patient-information',
  templateUrl: 'patient-information.html',
  providers: [PatientInformationService]
})
export class PatientInformationPage {

  private hasPatientId;
  public lock: boolean;

  constructor(
    private alert: AlertController,
    private navParams: NavParams,
    private nav: NavController,
    private patientInformationService: PatientInformationService,
    private rootNav: RootNavController) {
    this.hasPatientId = navParams.get('patientId');
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad PatientInformation');
  // }

  public submit(response) {
    // this.rootNav.pop();
    this.nav.pop();
    if (this.navParams.data && this.navParams.data instanceof SchedulePage) {
      this.navParams.data.addOrEditQueue(response);
    }
  }

  toggleLock() {
    if (this.lock) {
      return this.validatePassword().then(response => {
        this.lock = !response;
      })
    } else {
      this.lock = true;
    }
  }

  ionViewCanLeave() {
    if (this.lock) {
      return this.validatePassword();
    } else {
      return true;
    }
  }

  validatePassword() {
    return new Promise((resolve, reject) => {
      let alert = this.alert.create({
        message: "Enter Password",
        inputs: [{
          name: 'password',
          placeholder: 'Password Here',
          type: 'password'
        }],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: data => {
              resolve(false);
            }
          },
          {
            text: 'Proceed',
            handler: data => {
              this.patientInformationService.verifyPassword(data.password).subscribe(response => {
                if (response && response.status) {
                  resolve(true);
                }
                resolve(false);
              });
            }
          }
        ]
      });
      alert.present();
    })
  }

}
