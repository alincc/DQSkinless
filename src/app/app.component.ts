import { Component, ViewChild, EventEmitter } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '../services/services';
import { LoginPage } from '../pages/login/login.page';
import { HttpService } from '../services/services';
import { MESSAGES } from '../config/config';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  private rootPage = LoginPage;
  private alertCallback: EventEmitter<any> = new EventEmitter();
  @ViewChild('rootApp')
  private app: any;
  constructor(platform: Platform,
    private storage: Storage,
    private httpService: HttpService,
    private alertCtrl: AlertController,
    private splashscreen: SplashScreen,
    private statusBar: StatusBar) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashscreen.hide();
      //error message
      httpService.errorEvent.subscribe(_err => {
        this.alert(_err);
      });
      //unauthorized access
      httpService.unauthorizedEvent.subscribe(_err => {
        this.alert(_err).subscribe(() => {
          this.rootPage = LoginPage;
        });
      });
    });
  }

  private alert(_err) {
    let message;
    if ((typeof _err) === 'string') {
      message = _err;
    } else if (_err) {
      message = _err.errorDescription;
    }
    let errorMessage = this.alertCtrl.create({
      message: message || MESSAGES.ERROR.GENERIC,
      buttons: ['Dismiss']
    });
    errorMessage.onDidDismiss(() => {
      this.alertCallback.emit(_err);
    })
    errorMessage.present();
    return this.alertCallback;
  }

}
