import { Component, ViewChild } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Storage } from '../services/services';
import { LoginPage } from '../pages/login/login.page';
import { PatientProfilePage } from '../pages/patient-profile/patient-profile.page';
import { HttpService } from '../services/services';
import { MESSAGES } from '../config/config';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = LoginPage;
  @ViewChild('rootApp')
  private app: any;
  constructor(platform: Platform,
    private storage : Storage,
    private httpService: HttpService,
    private alert: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      //error message
      httpService.errorEvent.subscribe(err=>{
        let errorMessage = alert.create({
          message: err.errorDescription || MESSAGES.ERROR.GENERIC,
          buttons:['Dismiss']
        });
        errorMessage.present();  
      })
    });
  }

}
