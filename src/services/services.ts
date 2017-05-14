import { Injectable, EventEmitter } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { MESSAGES } from '../config/config';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Endpoint } from '../config/endpoint';

import { File } from '@ionic-native/file';

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
	ACCOUNT: 'account',
	USER_DETAILS: 'userDetails',
	TOKEN: 'token',
	CONFIG: 'config',
	CLINIC: 'clinic',
	ACCESS_ROLE: 'accessRole'
}

@Injectable()
export class Storage {

	constructor(private local: LocalStorageService,
		private session: SessionStorageService) { }

	// account
	private _accountSubject: BehaviorSubject<any>;

	public get account() {
		return this.local.retrieve(STORAGE_KEYS.ACCOUNT);
	}

	public set account(data) {
		if (!this._accountSubject) {
			this._accountSubject = new BehaviorSubject(this.account || {});
		} else {
			this._accountSubject.next(data);
		}
		this.local.store(STORAGE_KEYS.ACCOUNT, data);
	}

	public get accountSubject() {
		if (!this._accountSubject) {
			this._accountSubject = new BehaviorSubject(this.account || {});
		}
		return this._accountSubject;
	}

	// user Details
	private _userDetailsSubject: BehaviorSubject<any>;

	public get userDetails() {
		return this.local.retrieve(STORAGE_KEYS.USER_DETAILS);
	}

	public set userDetails(data) {
		if (!this._userDetailsSubject) {
			this._userDetailsSubject = new BehaviorSubject(this.userDetails || {});
		} else {
			this._userDetailsSubject.next(data);
		}
		this.local.store(STORAGE_KEYS.USER_DETAILS, data);
	}

	public get userDetailsSubject() {
		if (this._userDetailsSubject) {
			this._userDetailsSubject = new BehaviorSubject(this.userDetails || {});
		}
		return this._userDetailsSubject;
	}


	// clinic details
	private _clinicSubject: BehaviorSubject<any>;

	public get clinic() {
		return this.local.retrieve(STORAGE_KEYS.CLINIC);
	}

	public set clinic(data) {
		if (!this._clinicSubject) {
			this._clinicSubject = new BehaviorSubject(this.clinic || {});
		} else {
			this._clinicSubject.next(data);
		}
		this.local.store(STORAGE_KEYS.CLINIC, data);
	}

	public get clinicSubject() {
		if (this._clinicSubject) {
			this._clinicSubject = new BehaviorSubject(this.clinic || {});
		}
		return this._clinicSubject;
	}

	// access role
	private _accessRoleSubject: BehaviorSubject<any>;

	public get accessRole() {
		return this.local.retrieve(STORAGE_KEYS.ACCESS_ROLE);
	}

	public set accessRole(data) {
		if (!this._accessRoleSubject) {
			this._accessRoleSubject = new BehaviorSubject(this.accessRole || {});
		} else {
			this._accessRoleSubject.next(data);
		}
		this.local.store(STORAGE_KEYS.ACCESS_ROLE, data);
	}

	public get accessRoleSubject() {
		if (!this._accessRoleSubject) {
			this._accessRoleSubject = new BehaviorSubject(this.accessRole || {});
		}
		return this._accessRoleSubject;
	}

	//token
	public get token() { return this.local.retrieve(STORAGE_KEYS.TOKEN); }
	public set token(data) { this.local.store(STORAGE_KEYS.TOKEN, data); }

	public get config() { return this.local.retrieve(STORAGE_KEYS.CONFIG); }
	public set config(data) { this.local.store(STORAGE_KEYS.CONFIG, data); }


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

const IMG_PATH = "diagram";


@Injectable()
export class Images {

	constructor(private file: File,
		private storage: Storage) {
	}

	// save image locally and if connected to net sync to cloud
	public saveImage(filename, content, contentType?): Promise<any> {

		return new Promise((resolve, reject) => {
			// fetching path
			console.log("Starting to get Path.");
			let DataBlob = this.b64toBlob(content, contentType);
			let DataPath = this.getTargetSD();

			let ImgPath = DataPath + IMG_PATH;
			this.checkAndCreateDirectory(DataPath, () => {

				console.log("Path target is : " + ImgPath,
					"Resolving Path");
				this.file.resolveDirectoryUrl(ImgPath).then((dir) => {

					console.log("Access to the directory granted succesfully");
					this.file.writeFile(ImgPath, filename, DataBlob, {}).then(file => {
						console.log("File created succesfully.", file);
						resolve(file);
					}, err => {
						console.log("File create was unsuccesfull", err);
						reject(err);
					})

				}, err => {
					console.log('Unable to save file in path ' + ImgPath);
					reject(err);
				});
			})
		});
	}

	//check if directory is present;
	private checkDirectory(DataPath: string, callback: any, errorHandler?: any) {
		console.log("Check if dir exist:", DataPath);
		this.file.checkDir(DataPath, IMG_PATH).then(resolve => {
			console.log("directory exist");
			callback(resolve);
		}, reject => {
			errorHandler(reject);
		})
	}
	//check if directory is present if not create new;
	private checkAndCreateDirectory(DataPath: string, callback: any) {
		this.checkDirectory(DataPath, resolve => {
			callback(resolve);
		}, err => {
			console.log("creating directory");
			this.file.createDir(DataPath, IMG_PATH, true).then(resolve => {
				console.log("created dir: ", resolve);
				callback(resolve);
			}, err => {
				throw err;
			});
		})
	}

	public setTargetSD(target) {
		this.storage.config = this.storage.config.imgPath = target;
	}

	private getTargetSD(): string {
		return this.storage.config && this.storage.config.imgPath ? this.file.externalCacheDirectory : this.file.cacheDirectory;
	}

	// sync image to cloud
	private getFromCloud() {
		//TODO: waitiing for api
		return null;
	}


	//get base64 Image that auto sync from cloud when missing
	public getImage(fileName): Promise<string> {
		console.log("fetching ", fileName)
		return new Promise((resolve, reject) => {
			let dataPath = this.getTargetSD();
			let imgPath = dataPath + IMG_PATH;
			this.checkDirectory(dataPath, response => {
				this.file.resolveDirectoryUrl(imgPath).then((dir) => {
					this.file.readAsDataURL(imgPath, fileName).then(file => {
						resolve(file);
					})
				}, err => {
					console.log("Access to the directory is not granted");
					resolve(this.getFromCloud());
				});
			}, err => {
				console.log("Directory not found, maybe not created due to no existing img")
				resolve(this.getFromCloud());
			})
			return null;
		});

	}


	private b64toBlob(b64Data, contentType?, sliceSize?) {
		contentType = contentType || '';
		sliceSize = sliceSize || 512;

		var byteCharacters = atob(b64Data);
		var byteArrays = [];

		for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			var slice = byteCharacters.slice(offset, offset + sliceSize);

			var byteNumbers = new Array(slice.length);
			for (var i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}

			var byteArray = new Uint8Array(byteNumbers);

			byteArrays.push(byteArray);
		}

		var blob = new Blob(byteArrays, { type: contentType });
		return blob;
	}

}