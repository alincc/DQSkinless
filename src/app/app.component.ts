import { Component, ViewChild, EventEmitter } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
//pluginm
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
//core
import { HttpService, Push, Storage } from '../services';
import { MESSAGES } from '../config/config';
//pages
import { LoginPage } from '../pages/login/login.page';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  private rootPage = LoginPage;
  private alertCallback: EventEmitter<any> = new EventEmitter();
  constructor(platform: Platform,
    private storage: Storage,
    private httpService: HttpService,
    private alertCtrl: AlertController,
    private splashscreen: SplashScreen,
    private statusBar: StatusBar,
    private network: Network,
    private push: Push) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashscreen.hide();
      //cordova based plugin
      if(platform.is('cordova')){
        // push notification
        push.init();
        // push.receivedObservable.subscribe(response=>{
        //   console.log('push',response);
        // });
        // push.openedObservable.subscribe(response =>{
        //   console.log('opened', response);
        // })
      }
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
      
      network.onConnect().subscribe(() => {
        setTimeout(() => {
          this.alert("connected");
        }, 1000);

        setTimeout(() => {
          if(network.type != null)
          this.alert(network.type);
        }, 1000);
      });

      network.onDisconnect().subscribe(() => {
        setTimeout(() => {
          this.alert(MESSAGES.ERROR.NO_INTERNET);
        }, 1000);
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
