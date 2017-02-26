import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { CanvasWhiteboardModule } from 'ng2-canvas-whiteboard';

import { MyApp } from './app.component';

import { components } from './components';
import { pages } from './pages';

// services
import { RootNavController } from '../services/services';

// shared
import { EqualValidatorDirective } from '../shared/equal-validation.directive';

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
    CanvasWhiteboardModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    pages,
    components
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, ConfigurationService, RootNavController]
})
export class AppModule { }
