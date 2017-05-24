import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class RootNavController {
	private _rootNav: any;
	public reloadPublisher: BehaviorSubject<any>;

	public getRootNav() {
		return this._rootNav;
	}

	public setRootNav(rootNav: any) {
		this._rootNav = rootNav;
	}

	public push(page: any, param?: any) {
		this._rootNav.push(page, param);
	}

	public setRoot(page: any, param?: any) {
		this._rootNav.setRoot(page, param);
	}

	public pop() {
		this._rootNav.pop();
	}

	public loadInit(clinicId: number) {
		// if(this.reloadPublisher){
		// 	this.reloadPublisher.next(clinicId);
		// }else{
		this.reloadPublisher = new BehaviorSubject<any>(clinicId);
		// }
	}
}