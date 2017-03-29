import { Injectable, EventEmitter } from '@angular/core';
import { Locker, DRIVERS } from 'angular2-locker';
import { Headers, Http, RequestOptions,Response } from '@angular/http';
import { HTTP_CONFIG, MESSAGES } from '../config/config';
import { environment } from '../config/environment';
import { Observable } from 'rxjs/Observable';
import { Endpoint } from '../config/endpoint';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class RootNavController {
	private _rootNav: any;

	public getRootNav() {
		return this._rootNav;
	}

	public setRootNav(rootNav: any) {
		this._rootNav = rootNav;
	}

	public push(page: any) {
		this._rootNav.push(page);
	}

	public pop() {
		this._rootNav.pop();
	}

}

export const STORAGE_KEYS = {
	DIMENSION: 'dimension',
	USER_DETAILS: 'userDetails',
	TOKEN: 'token'
}

@Injectable()
export class Storage {
	private local: any;
	private session: any;

	constructor(private locker: Locker) {
		this.local = locker.useDriver(DRIVERS.LOCAL);
		this.session = locker.useDriver(DRIVERS.SESSION);
	}

	// userDetails
	public get userDetails() { return this.local.get(STORAGE_KEYS.USER_DETAILS); }
	public set userDetails(data) { this.local.set(STORAGE_KEYS.USER_DETAILS, data); }

	public get token() { return this.local.get(STORAGE_KEYS.TOKEN); }
	public set token(data) { this.local.set(STORAGE_KEYS.TOKEN, data); }


}

@Injectable()
export class HttpService {

	public errorEvent: EventEmitter<any>;
	public unauthorizedEvent: EventEmitter<any>;
	public _token: string;

	constructor(
		private http: Http,
		private storage: Storage) {
		this.errorEvent = new EventEmitter();
		this.unauthorizedEvent = new EventEmitter();
	}

	public get token(){
		if(!Boolean(this._token)){
			this._token === this.storage.token;
		}
		return this._token;
	}
	public set token(data){
		this._token = data;
		this.storage.token = data;
	}

	private extractData(response : Response) {
		let _response = response.json();
		if (_response.status) {
			return _response;
		} else {
			return this.errorHandler(_response);
		}
	}

	private getOptions(): RequestOptions {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		headers.append('Authorization', 'Bearer ' + this.token);

		let options = new RequestOptions({ headers: headers });
		return options;
	}

	public get(url, ...parameters): Observable<any> {
		let parameter:string = '';
		for (let _parameter of parameters) {
			parameter += "/" + _parameter;
		}
		return this.http.get(Endpoint.environment + url + parameter, this.getOptions())
			.map(response => this.extractData(response))
			.catch(err => this.errorHandler(err));
	}

	public post(url: string, parameters: any ): Observable<any> {
		return this.http.post(Endpoint.environment + url, parameters, this.getOptions())
			.map(response => this.extractData(response))
			.catch(err => this.errorHandler(err));
	}

	public put(url:string, paramters: any): Observable<any>{
		return this.http.put(Endpoint.environment + url, paramters, this.getOptions())
				.map(response => this.extractData(response))
				.catch(err => this.errorHandler(err));
	}

	private errorHandler(err: any) {
		if (err.status === 401) {
			this.unauthorizedEvent.emit();
		} else if (err.status === 404) {
			this.errorEvent.emit(MESSAGES.ERROR.NOT_FOUND);
		} else {
			this.errorEvent.emit(err);
		}
		if(err instanceof Response){
			return Observable.throw(err);
		}
		if (err.status === 0) {
			return err;
		}
	}



}