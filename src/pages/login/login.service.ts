import { Injectable } from '@angular/core';
import { HttpService } from '../../services/services';
import { CONFIG } from '../../config/config'

@Injectable()
export class LoginService{
	constructor(private http: HttpService){}


	public authenticate(username, password){
		let _parameter = {
			username : username,
			password : password
		}
		return this.http.post(CONFIG.API.authenticate, _parameter)
			.map(response => {
				if(response.status)
					this.http.token = response.result.token;
				return response;
			});
	}
}