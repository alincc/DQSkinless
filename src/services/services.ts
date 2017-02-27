import { Injectable } from '@angular/core';
import { Locker, DRIVERS } from 'angular2-locker'

@Injectable()
export class RootNavController{
	private _rootNav: any;

	public getRootNav(){
		return this._rootNav;
	}

	public setRootNav(rootNav:any){
		this._rootNav = rootNav;
	}

	public push( page:any){
		this._rootNav.push(page);
	}

	public pop(){
		this._rootNav.pop();
	}

}

export const STORAGE_KEYS = {
	DIMENSION : 'dimension'
}

@Injectable()
export class Storage{
	private local:any;
	private session:any;

	constructor(private locker: Locker){
		this.local = locker.useDriver(DRIVERS.LOCAL);
		this.session = locker.useDriver(DRIVERS.SESSION);
	}
	
}