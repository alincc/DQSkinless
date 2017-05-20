import { Injectable } from '@angular/core';
import { HttpService, Storage } from '../../services';
import { CONFIG } from '../../config/config';
import { LOVS } from '../../constants/constants';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoginService {
	constructor(
		private http: HttpService,
		private storage: Storage) { }


	public authenticate(_username, _password) {
		return this.http.post(CONFIG.API.authenticate,
			 {
			 	username: _username, 
			 	password: _password
			 })
			.flatMap(response => {
				if (response.status) {
					this.http.token = response.result.token;
					this.storage.account = response.result.principal;

					//fetch for user details on the background
					let xhrUserDetails = response.result.principal.role === 1 
						? this.http.get(CONFIG.API.doctorDetails, [response.result.principal.userId])
						: this.http.get(CONFIG.API.assistantDetails, [response.result.principal.userId]);

					//retain credential to be sent rather than user details
					return new Observable<any>(subscribe => {
						xhrUserDetails.subscribe(_response => {
							if(response.status){
								this.storage.userDetails = _response.result;
								subscribe.next(response)
							}
						});
					})
				}else{
					Observable.throw(response.errorDescription);
				}
			});
	}
}
