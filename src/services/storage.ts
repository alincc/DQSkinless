import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { OneSignal } from '@ionic-native/onesignal';

export const STORAGE_KEYS = {
	ACCOUNT: 'account',
	USER_DETAILS: 'userDetails',
	TOKEN: 'token',
	CONFIG: 'config',
	CLINIC: 'clinic',
	ACCESS_ROLE: 'accessRole',
	PATIENT_OWNER: 'patientOwner',
	CLINIC_MEMBERS: 'clinicMembers'
}

@Injectable()
export class Storage {

	constructor(private local: LocalStorageService,
		private session: SessionStorageService,
		private push: OneSignal) { }

	// account
	private _accountSubject = new BehaviorSubject<any>(undefined);
	public accountSubject: Observable<any> = this._accountSubject.asObservable();

	public get account() {
		return this.local.retrieve(STORAGE_KEYS.ACCOUNT);
	}

	public set account(data) {
		this._accountSubject.next(data);
		this.local.store(STORAGE_KEYS.ACCOUNT, data);
		//accountId for push notif
		this.push.sendTag('account', data.id);
	}

	// user Details
	private _userDetailsSubject = new BehaviorSubject<any>(undefined);
	public userDetailsSubject: Observable<any> = this._userDetailsSubject.asObservable();

	public get userDetails() {
		return this.local.retrieve(STORAGE_KEYS.USER_DETAILS);
	}

	public set userDetails(data) {
		this._userDetailsSubject.next(data);
		this.local.store(STORAGE_KEYS.USER_DETAILS, data);
	}

	// clinic details
	private _clinicSubject = new BehaviorSubject<any>(undefined);
	public clinicSubject: Observable<any> = this._clinicSubject.asObservable();

	public get clinic() {
		return this.local.retrieve(STORAGE_KEYS.CLINIC);
	}

	public set clinic(data) {
		this._clinicSubject.next(data);
		this.local.store(STORAGE_KEYS.CLINIC, data);
		// tag clinic
		this.push.sendTag('clinic', data.id);
	}

	public getClinicSubjectValue() {
		return this._clinicSubject.getValue();
	}

	// access role
	private _accessRoleSubject = new BehaviorSubject<any>(undefined);
	public accessRoleSubject: Observable<any> = this._accessRoleSubject.asObservable();

	public get accessRole() {
		return this.local.retrieve(STORAGE_KEYS.ACCESS_ROLE);
	}

	public set accessRole(data) {
		this._accessRoleSubject.next(data);
		this.local.store(STORAGE_KEYS.ACCESS_ROLE, data);
	}

	// patient owner
	private _patientOwnerSubject = new BehaviorSubject<any>(undefined);
	public patientOwnerSubject: Observable<any> = this._patientOwnerSubject.asObservable();

	public get patientOwner() {
		return this.local.retrieve(STORAGE_KEYS.PATIENT_OWNER);
	}

	public set patientOwner(data) {
		this._patientOwnerSubject.next(data);
		this.local.store(STORAGE_KEYS.PATIENT_OWNER, data);
	}

	public getPatientOwnerSubjectValue() {
		return this._patientOwnerSubject.getValue();
	}

	private _clinicMembersSubject = new BehaviorSubject<any>(undefined);
	public clinicMembersSubject: Observable<any> = this._clinicMembersSubject.asObservable();

	public get clinicMembers() {
		return this.session.retrieve(STORAGE_KEYS.CLINIC_MEMBERS);
	}

	public set clinicMembers(data) {
		this._clinicMembersSubject.next(data);
		this.session.store(STORAGE_KEYS.CLINIC_MEMBERS, data);
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