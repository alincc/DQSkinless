import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { components } from './components';
import { pages } from './pages';
import { RootNavController } from '../services/services';
import { CanvasWhiteboardModule } from 'ng2-canvas-whiteboard';
@NgModule({
  declarations: [
    MyApp,
    pages,
    components
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    CanvasWhiteboardModule
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
