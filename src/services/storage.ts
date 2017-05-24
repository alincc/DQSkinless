import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { OneSignal } from '@ionic-native/onesignal';

export const STORAGE_KEYS = {
	ACCOUNT: 'account',
	USER_DETAILS: 'userDetails',
	TOKEN: 'token',
	CONFIG: 'config',
	CLINIC: 'clinic',
	ACCESS_ROLE: 'accessRole',
	CLINIC_MEMBERS: 'clinicMembers'
}

@Injectable()
export class Storage {

	constructor(private local: LocalStorageService,
		private session: SessionStorageService,
		private push: OneSignal) { }

	// account
	private _accountSubject: BehaviorSubject<any>;

	public get account() {
		return this.local.retrieve(STORAGE_KEYS.ACCOUNT);
	}

	public set account(data) {
		if (!this._accountSubject) {
			this._accountSubject = new BehaviorSubject(this.account);
		} else {
			this._accountSubject.next(data);
		}
		this.local.store(STORAGE_KEYS.ACCOUNT, data);
		//accountId for push notif
		this.push.sendTag('account',data.id);

	}

	public get accountSubject() {
		if (!this._accountSubject) {
			this._accountSubject = new BehaviorSubject(this.account);
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
			this._userDetailsSubject = new BehaviorSubject(this.userDetails);
		} else {
			this._userDetailsSubject.next(data);
		}
		this.local.store(STORAGE_KEYS.USER_DETAILS, data);
	}

	public get userDetailsSubject() {
		if (!this._userDetailsSubject) {
			this._userDetailsSubject = new BehaviorSubject(this.userDetails);
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
			this._clinicSubject = new BehaviorSubject(this.clinic);
		} else {
			this._clinicSubject.next(data);
		}
		this.local.store(STORAGE_KEYS.CLINIC, data);
		// tag clinic
		this.push.sendTag('clinic', data.id);
	}

	public get clinicSubject() {
		if (!this._clinicSubject) {
			this._clinicSubject = new BehaviorSubject(this.clinic);
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
			this._accessRoleSubject = new BehaviorSubject(this.accessRole);
		} else {
			this._accessRoleSubject.next(data);
		}
		this.local.store(STORAGE_KEYS.ACCESS_ROLE, data);
	}

	public get accessRoleSubject() {
		if (!this._accessRoleSubject) {
			this._accessRoleSubject = new BehaviorSubject(this.accessRole);
		}
		return this._accessRoleSubject;
	}


	private _clinicMembersSubject: BehaviorSubject<any>;

	public get clinicMembers(){
		return this.session.retrieve(STORAGE_KEYS.CLINIC_MEMBERS);
	}

	public set clinicMembers(data){
		if (!this._clinicMembersSubject) {
			this._clinicMembersSubject = new BehaviorSubject(this.clinicMembers);
		} else {
			this._clinicMembersSubject.next(data);
		}
		this.session.store(STORAGE_KEYS.CLINIC_MEMBERS, data);
	}

	public get clinicMembersSubject(){
		if (!this._clinicMembersSubject) {
			this._clinicMembersSubject = new BehaviorSubject(this.clinicMembers);
		}
		return this._clinicMembersSubject;
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