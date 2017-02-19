import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { pages } from './pages';
import { RootNavController } from '../services/services';
@NgModule({
  declarations: [
    MyApp,
    pages
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    pages
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, RootNavController ]
})
export class AppModule {}
