import { Component } from '@angular/core';
import { TabsPage } from '../tabs/tabs';
import { NavController } from 'ionic-angular';


@Component({
	selector: 'manager-page',
	templateUrl: 'manager.html'
})
export class ManagerPage{
	
	constructor(private nav: NavController){

	}

	go(){
		this.nav.push(TabsPage);
	}
}	