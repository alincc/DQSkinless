import { Component, ViewChild } from '@angular/core';
import { NavController,Content } from 'ionic-angular';
import { StepOnePage } from './step-one/step-one.page';
import { ManagerPage } from "../manager/manager.page";

@Component({
	selector: 'registration-page',
	templateUrl: 'registration.html'
})
export class RegistrationPage {
	@ViewChild(Content) content: Content;
	public root: any;
	public params: any;
	public _step: number;

	constructor(private nav: NavController) {
		this.root = StepOnePage;
		this.params = {
			parentNav: nav,
			parent: this,
			registrationData: {}
		};
	}


	public set step(_step:any){
		console.log("fn",_step);
		console.log("this",this._step);
		if(_step == 4){
			this.content!.resize();
		}
		this._step = _step;
	}

	public get step(){
		return this._step;
	}

	public done(){
		this.nav.push(ManagerPage);
	}
}