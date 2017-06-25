import { Component } from '@angular/core';
import { NavParams, NavController, AlertController } from 'ionic-angular';

import { RootNavController } from '../../services';

import { SchedulePage } from '../schedule/schedule.page';

@Component({
  selector: 'page-patient-information',
  templateUrl: 'patient-information.html',
})
export class PatientInformationPage {


  private hasPatientId;
  private lock: boolean;

  constructor(
    private navParams: NavParams,
    private rootNav: RootNavController,
    private nav: NavController,
    private alert: AlertController) {

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
        buttons: [{
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            resolve(false);
          }
        }, {
          text: 'Proceed',
          handler: data => {
            if (data.password === 'admin') {
              resolve(true);
            } else {
              return false;
            }
          }
        }
        ]
      });
      alert.present();
    })
  }

}
