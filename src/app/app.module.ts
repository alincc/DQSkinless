import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { Ng2Webstorage, LocalStorageService, SessionStorageService } from 'ngx-webstorage'
import { components } from './components';
import { pages } from './pages';
// services
import { RootNavController,
     Storage,
     HttpService,
     WebSocketFactory,
     Images } from '../services/services';

// native
import { ActionSheet } from '@ionic-native/action-sheet';
import { Camera } from '@ionic-native/camera';
import { Device } from '@ionic-native/device';
import { Keyboard } from '@ionic-native/keyboard';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { File } from '@ionic-native/file';

@NgModule({
  declarations: [
    MyApp,
    pages,
    components
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    FormsModule,
    ReactiveFormsModule,
    Ng2Webstorage,
    BrowserAnimationsModule
  ], 
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    pages,
    components
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler },
    RootNavController,
    Storage,
    HttpService,
    WebSocketFactory,
    Images,

    SessionStorageService,
    LocalStorageService,

    ActionSheet,
    Camera,
    Device,
    Keyboard,
    SplashScreen,
    StatusBar,
    File
  ]
})
export class AppModule { }
