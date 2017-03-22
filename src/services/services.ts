import { Injectable, EventEmitter } from '@angular/core';
import { Locker, DRIVERS } from 'angular2-locker';
import { Http } from '@angular/http';
import { HTTP_CONFIG, MESSAGES } from '../config/config';
import { environment } from '../config/environment';
import { Observable } from 'rxjs/Observable';
import { Endpoint } from '../config/endpoint';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

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

@Injectable()
export class HttpService{

	public errorEvent: EventEmitter<any>;
	public unauthorizedEvent: EventEmitter<any>;
	public token: string;

	constructor(private http: Http){
		this.errorEvent = new EventEmitter();
 		this.unauthorizedEvent = new EventEmitter();
	}

	private extractData(response){
		let _response = response.json();
		if(_response.status){
			return _response;
		}else{
			return this.errorHandler(_response);
		}
	}

	public get( url, ...parameters):Observable<any>{
		let _url:string = url;
		for(let _parameter of parameters){
			_url += "/"+_parameter;
		}
		return  this.http.get(Endpoint.environment+url)
		.map(response => this.extractData(response))
		.catch(err => this.errorHandler(err));
	}

	public post(url:string, parameters:any) : Observable<any>{
		return this.http.post(Endpoint.environment+url,parameters)
		.map(response => this.extractData(response))
		.catch(err => this.errorHandler(err));
	}

	private errorHandler(err:any){
		if(err.status === 401){
			this.unauthorizedEvent.emit();
		}else if(err.status === 404){
			this.errorEvent.emit(MESSAGES.ERROR.NOT_FOUND);
		}else{
			this.errorEvent.emit(err);
		}
		// Observable.throw(err);
		if(err.status === 0){
			return err;
		}
		return Observable.throw(err);
	}


}