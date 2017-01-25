import { Component } from '@angular/core';

import { SchedulePage } from '../schedule/schedule.page';
import { PatientPage } from '../patient/patient.page';
import { ChatPage } from '../chat/chat.page';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = SchedulePage;
  tab2Root: any = PatientPage;
  tab3Root: any = ChatPage;

  constructor() {

  }
}
