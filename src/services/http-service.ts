import { Injectable, EventEmitter } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Endpoint } from '../config/endpoint';
import { Observable } from 'rxjs/Observable';
import { MESSAGES } from '../config/config';
import { Storage } from './storage';


@Injectable()
export class HttpService {

	private _token: string;
	public errorEvent: EventEmitter<any>;
	public unauthorizedEvent: EventEmitter<any>;

	constructor(
		private http: Http,
		private storage: Storage) {
		this.errorEvent = new EventEmitter();
		this.unauthorizedEvent = new EventEmitter();
	}

	public get token() {
		if (!Boolean(this._token)) {
			this._token === this.storage.token;
		}
		return this._token;
	}
	public set token(data) {
		this._token = data;
		this.storage.token = data;
	}

	private extractData(response: Response) {
		let _response = response.json();
		if (_response.status) {
			return _response;
		} else {
			return this.errorHandler(_response);
		}
	}

	public get(url: string, parameters: any, option?: any): Observable<any> {
		let parameter: string = '';
		if (Array.isArray(parameters)) {
			for (let _parameter of parameters) {
				parameter += "/" + _parameter;
			}
		} else {
			parameter += "/" + parameters
		}

		return this.http.get(Endpoint.environment + url + parameter, this.getOptions())
			.map(response => this.extractData(response))
			.catch(err => option && option.silentError ? null : this.errorHandler(err));
	}

	public delete(url, ...parameters): Observable<any> {
		let parameter: string = '';
		for (let _parameter of parameters) {
			parameter += "/" + _parameter;
		}
		return this.http.delete(Endpoint.environment + url + parameter, this.getOptions())
			.map(response => this.extractData(response))
			.catch(err => this.errorHandler(err));
	}

	public post(url: string, parameters: any): Observable<any> {
		return this.http.post(Endpoint.environment + url, parameters, this.getOptions())
			.map(response => this.extractData(response))
			.catch(err => this.errorHandler(err));
	}

	public put(url: string, paramters: any): Observable<any> {
		return this.http.put(Endpoint.environment + url, paramters, this.getOptions())
			.map(response => this.extractData(response))
			.catch(err => this.errorHandler(err));
	}

	private errorHandler(err: any) {
		if (err instanceof Response) {
			return Observable.throw(err);
		} else {
			if (err.status === 401) {
				this.unauthorizedEvent.emit();
			} else if (err.status === 404) {
				this.errorEvent.emit(MESSAGES.ERROR.NOT_FOUND);
			} else if (err.status === 0) {
				this.errorEvent.emit(err.errorDescription);
			} else {
				this.errorEvent.emit(err);
			}
			return err;
		}
	}

	private getOptions = function (): RequestOptions {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		headers.append('Authorization', 'Bearer ' + this._token);

		let options = new RequestOptions({ headers: headers });
		return options;
	}


}