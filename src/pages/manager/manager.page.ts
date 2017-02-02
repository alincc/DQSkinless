import { Component } from '@angular/core';
import { TabsPage } from '../tabs/tabs';
import { App } from 'ionic-angular';


@Component({
	selector: 'manager-page',
	templateUrl: 'manager.html'
})
export class ManagerPage{
	
	constructor(private app: App){}

	go(){
		this.app.getRootNav().setRoot(TabsPage);
	}
}	