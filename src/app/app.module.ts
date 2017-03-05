import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LockerModule, Locker } from 'angular2-locker';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';

import { components } from './components';
import { pages } from './pages';

// services
import { RootNavController, Storage } from '../services/services';

import { EqualValidatorDirective } from '../shared/directive/equal-validation.directive';

// utilities
import { ConfigurationService } from '../utilities/configuration.service';

@NgModule({
  declarations: [
    MyApp,
    pages,
    components,
    EqualValidatorDirective
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
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }
    , ConfigurationService
    , Locker
    , RootNavController
    , Storage
  ]
})
export class AppModule { }
