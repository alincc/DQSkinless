import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LockerModule, Locker } from 'angular2-locker';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { components } from './components';
import { pages } from './pages';

// services
import { RootNavController, Storage, HttpService } from '../services/services';

// native
import { ActionSheet } from '@ionic-native/action-sheet';
import { Camera } from '@ionic-native/camera';
import { Device } from '@ionic-native/device';
import { Keyboard } from '@ionic-native/keyboard';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

@NgModule({
  declarations: [
    MyApp,
    pages,
    components
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    FormsModule,
    ReactiveFormsModule,
    LockerModule
  ], bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    pages,
    components
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler },
    Locker,
    RootNavController,
    Storage,
    HttpService,
    //native
    ActionSheet,
    Camera,
    Device,
    Keyboard,
    SplashScreen,
    StatusBar
  ]
})
export class AppModule { }
