import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavParams } from "ionic-angular";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { RootNavController, Storage } from '../../services/services';
import { StackedServices } from '../../utilities/utilities';

import { LOVS, MODE } from '../../constants/constants'

import { ClinicPage } from './clinic/clinic.page';
import { AssociateMemberPage } from './associate-member/associate-member.page';

import { ClinicManagerService } from './clinic-manager.service';

@Component({
	selector: 'clinic-manager-page',
	templateUrl: 'clinic-manager.html',
	providers: [ClinicManagerService]
})
export class ClinicManagerPage implements OnInit {

	public allowableClinics: any;
	public clinics: any;
	public contactType: any;
	public days: any;
	public ownedClinics: any;
	public isManager: boolean;

	private accessRole;
	private userRole;
	private loading: any;
	private clinicDetailsObservables: StackedServices;

	constructor(
		private alertController: AlertController,
		private loadingController: LoadingController,
		private params: NavParams,
		private rootNav: RootNavController,
		private storage: Storage,
		private clinicManagerService: ClinicManagerService) {
		this.getDefaults();
	}

	public ngOnInit() {
		this.clinics = [];
		this.ownedClinics = [];
		this.showLoading();

		if (this.userRole === 1) {
			this.clinicManagerService.getNoOfClinics().subscribe(response => {
				if (response && response.status) {
					this.allowableClinics = response.result;
				}
			});
		}

		this.clinicDetailsObservables.push(
			this.clinicManagerService.getClinicAccessByUserId().map(response => {
				if (response && response.status) {
					this.ownedClinics = response.result.filter(r => r.accessRole === 0);
				}
				return Observable.of(response);
			}));

		this.clinicDetailsObservables.push(
			this.clinicManagerService.getClinicRecord().map(response => {
				if (response) {
					this.clinics = response;

					if (this.params.data.parent && this.clinics.length > 0) {
						this.params.data.parent.completedRegistration = true;
					}
				}
				return Observable.of(response);
			}));

		this.clinicDetailsObservables.executeFork().subscribe(response => {
			this.dismissLoading()
		}, err => this.dismissLoading());
	}

	private getDefaults() {
		this.days = LOVS.DAYS;
		this.contactType = LOVS.CONTACT_TYPE;
		this.allowableClinics = 0;
		this.clinicDetailsObservables = new StackedServices([]);
		this.storage.accessRoleSubject.subscribe(accessRole => {
			if (accessRole) {
				this.accessRole = accessRole.accessRole;
			}
		});
		this.storage.accountSubject.subscribe(account => {
			if (account) {
				this.userRole = account.role;
			}
		})
		this.isManager = this.params.data && this.params.data.isManager ? this.params.data.isManager : false;
	}

	private getClinics() {
		this.clinics = [];
		this.ownedClinics = [];
		this.showLoading();

		this.clinicDetailsObservables.executeFork().subscribe(response => {
			this.dismissLoading()
		}, err => this.dismissLoading());
	}

	private showLoading() {
		this.loading = this.loadingController.create({
			spinner: 'crescent',
			cssClass: 'xhr-loading'
		});
		this.loading.present();
	}

	private dismissLoading() {
		if (this.loading) {
			this.loading.dismiss();
		}
	}

	public clinicManagerCallback = (params) => {
		return new Promise((resolve, reject) => {
			this.getClinics();

			if (this.params.data.parent) {
				this.params.data.parent.completedRegistration = true;
			}

			resolve();
		});
	}

	public addClinic() {
		this.rootNav.push(ClinicPage, {
			mode: MODE.add,
			callback: this.clinicManagerCallback
		});
	}

	public editClinic(clinic, index) {
		this.rootNav.push(ClinicPage, {
			callback: this.clinicManagerCallback,
			clinic: clinic,
			mode: MODE.edit
		});
	}

	public deleteClinic(clinic, i) {
		this.alertController.create({
			message: `Delete ${clinic.clinicName}?`,
			buttons: [
				{
					text: 'NO',
					role: 'cancel',
				},
				{
					text: 'YES',
					handler: () => {
						this.showLoading();
						this.clinicManagerService.deleteClinic(clinic.clinicId).subscribe(response => {
							if (response && response.status) {
								this.clinics.splice(i, 1);
								this.ownedClinics.splice(0, 1);

								if (this.params.data.parent && this.clinics.length === 0) {
									this.params.data.parent.completedRegistration = false;
								}
							}
							this.dismissLoading();
						}, err => this.dismissLoading());
					}
				}
			]
		}).present();
	}

	public associateMember(clinic) {
		this.rootNav.push(AssociateMemberPage, {
			clinicId: clinic.clinicId,
			accessRole: clinic.accessRole,
			isManager: this.isManager
		});
	}

	public displayTime(timeSlot) {
		if (timeSlot && timeSlot.length > 0) {
			let formattedTimeSlot = '';

			timeSlot.forEach(time => {
				formattedTimeSlot += `${time.startTime} to ${time.endTime}, `;
			});
			return formattedTimeSlot.substring(1, formattedTimeSlot.length - 2);
		}
		return '';
	}
}