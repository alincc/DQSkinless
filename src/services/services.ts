import { Injectable } from '@angular/core';

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