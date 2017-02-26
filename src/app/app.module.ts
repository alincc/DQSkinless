import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { components } from './components';
import { pages } from './pages';
import { RootNavController } from '../services/services';
import { CanvasWhiteboardModule } from 'ng2-canvas-whiteboard';
import { EqualValidatorDirective } from '../shared/equal-validation.directive';

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
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, RootNavController ]
})
export class AppModule { }
