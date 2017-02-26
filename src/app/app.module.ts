import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { components } from './components';
import { pages } from './pages';
import { RootNavController, Storage } from '../services';
import { LockerModule,Locker } from 'angular2-locker'
@NgModule({
  declarations: [
    MyApp,
    pages,
    components
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    LockerModule],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    pages,
    components
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}
  , RootNavController
  , Storage
  , Locker ]
})
export class AppModule { }
