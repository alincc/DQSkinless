import { Injectable } from '@angular/core';
import { HttpService, Storage } from '../../services/services';
import { CONFIG } from '../../config/config'

@Injectable()
export class ProfileFormService {
    constructor(
        private http: HttpService,
        private storage: Storage) { }


    public setDoctorDetails(_parameter) {
        _parameter.userId = this.storage.userDetails.userId;
        return this.http.put(CONFIG.API.doctorDetails, _parameter)
            .map(response => {
                return response;
            });
    }
}