import { Injectable } from '@angular/core';
import { HttpService, Storage } from '../../services/services';
import { CONFIG } from '../../config/config';

@Injectable()
export class ManagerService{
	constructor(private http: HttpService,
		private storage: Storage){}
	private userId;

    private getUserId() {
        if (!this.userId) {
            this.userId = this.storage.userDetails.userId;
        }
        return this.userId;
    }

	public getClinicAccessByUserId() {
        return this.http.get(CONFIG.API.getClinicAccessByUserId, [this.getUserId()]);
    }

    
    public getClinicRecordById(clinicId) {
        return this.http.get(CONFIG.API.clinicDetailRecord, [clinicId]);
    }
}