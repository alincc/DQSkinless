import { Injectable, EventEmitter } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { MESSAGES } from '../config/config';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Endpoint } from '../config/endpoint';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import * as SockJS from 'sockjs-client/dist/sockjs';
import * as StompJS from 'stompjs/lib/stomp.js';

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

export const STORAGE_KEYS = {
	USER_DETAILS: 'userDetails',
	TOKEN: 'token'
}

@Injectable()
export class Storage {

	constructor(private local: LocalStorageService,
		private session: SessionStorageService) { }

	// userDetails
	public get userDetails() { return this.local.retrieve(STORAGE_KEYS.USER_DETAILS); }
	public set userDetails(data) { this.local.store(STORAGE_KEYS.USER_DETAILS, data); }

	public get token() { return this.local.retrieve(STORAGE_KEYS.TOKEN); }
	public set token(data) { this.local.store(STORAGE_KEYS.TOKEN, data); }

	public clear() {
		this.local.clear();
	}
}

var _token: string;

@Injectable()
export class HttpService {

	public errorEvent: EventEmitter<any>;
	public unauthorizedEvent: EventEmitter<any>;

	constructor(
		private http: Http,
		private storage: Storage) {
		this.errorEvent = new EventEmitter();
		this.unauthorizedEvent = new EventEmitter();
	}

	public get token() {
		if (!Boolean(_token)) {
			_token === this.storage.token;
		}
		return _token;
	}
	public set token(data) {
		_token = data;
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
			.catch(err => option && option.silentError ? {} : this.errorHandler(err));
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
		if (err.status === 401) {
			this.unauthorizedEvent.emit();
		} else if (err.status === 404) {
			this.errorEvent.emit(MESSAGES.ERROR.NOT_FOUND);
		} else {
			this.errorEvent.emit(err);
		}
		if (err instanceof Response) {
			return Observable.throw(err);
		}
		if (err.status === 0) {
			return err;
		}
	}

	private getOptions = function (): RequestOptions {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		headers.append('Authorization', 'Bearer ' + _token);

		let options = new RequestOptions({ headers: headers });
		return options;
	}


}


@Injectable()
export class WebSocketFactory {

	public connect(url: String): any {
		var sock = new SockJS(Endpoint.environment + url, null, { headers: { Authorization: 'Bearer ' + _token } });
		var connection: any = new Observable(publisher => {

			sock.onmessage = response => {
				publisher.next(response.data);
			}
			sock.onclose = err => {
				publisher.error(err);
			}
		});

		return {
			send: (message) => { sock.send(message) },
			connection: connection,
			then: (callback) => {
				sock.onopen = response => {
					callback(response)
				}
			},
			close: () => { sock.close(); }
		};
	}
}
