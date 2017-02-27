import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Storage } from '../services/services';
import { LoginPage } from '../pages/login/login.page';
import { ConsultationFormPage } from '../pages/consultation-form/consultation-form';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = ConsultationFormPage;
  @ViewChild('rootApp')
  private app: any;
  constructor(platform: Platform,
    private storage : Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

}
