import { Component, OnInit } from '@angular/core';
import { AlertController, NavParams } from "ionic-angular";

import { RootNavController } from '../../services/services';

import { LOVS, MODE } from '../../constants/constants'

import { ClinicPage } from './clinic/clinic.page';

import { ClinicManagerService } from './clinic-manager.service';

@Component({
	selector: 'clinic-manager-page',
	templateUrl: 'clinic-manager.html',
	providers: [ClinicManagerService]
})
export class ClinicManagerPage implements OnInit {

	public allowableClinics: any;
	public clinics: any;

	public days: any;
	public contactType: any;

	private index: number;

	constructor(
		private alertController: AlertController,
		private params: NavParams,
		private rootNav: RootNavController,
		private clinicManagerService: ClinicManagerService) {
		this.getDefaults();
	}

	public ngOnInit() {
		this.clinics = []; // TODO IMPLEMENTED CLINIC RETRIEVAL

		this.clinicManagerService.getClinicAccessByUserId().subscribe(response => {
			if (response && response.status) {
				console.log(response);
			}
		});

		this.clinicManagerService.getNoOfClinics().subscribe(response => {
			if (response && response.status) {
				this.allowableClinics = response.result;
			}
		});

		if (this.params.data.parent && this.clinics.length > 0) {
			this.params.data.parent.completedRegistration = true;
		}
	}

	private getDefaults() {
		this.days = LOVS.DAYS;
		this.contactType = LOVS.CONTACT_TYPE;
		this.allowableClinics = 0;
	}

	public addClinic() {
		this.rootNav.push(ClinicPage, {
			mode: MODE.add
		});
	}

	public addClinicCallBack = (params) => {
		return new Promise((resolve, reject) => {
			this.clinics.push(params);
			this.allowableClinics--;

			if (this.params.data.parent) {
				this.params.data.parent.completedRegistration = true;
			}

			resolve();
		});
	}

	public editClinic(clinic, i) {
		this.index = i;
		this.rootNav.push(ClinicPage, {
			callback: this.editClinicCallBack,
			clinic: clinic,
			mode: 'Edit'
		});
	}

	public editClinicCallBack = (params) => {
		return new Promise((resolve, reject) => {
			if (this.params.data.parent) {
				if (this.index) {
					this.clinics[this.index] = params;
				}
			}

			resolve();
		});
	}

	public deleteClinic(clinic, i) {
		this.alertController.create({
			message: `Delete ${clinic.name}?`,
			buttons: [
				{
					text: 'NO',
					role: 'cancel',
				},
				{
					text: 'YES',
					handler: () => {
						this.clinics.splice(i, 1);
						this.allowableClinics++;

						if (this.params.data.parent.completedRegistration && this.clinics.length === 0) {
							this.params.data.parent.completedRegistration = false;
						}
					}
				}
			]
		}).present();
	}

	public displayTime(time) {
		if (time && time.length > 0) {
			let timeSlot = '';
			time = this.sortTime(time);

			time.forEach(time => {
				timeSlot += ` ${time.from} to ${time.to},`;
			});

			return timeSlot.substring(1, timeSlot.length - 1);
		}

		return '';
	}

	private sortTime(time) {
		return time.sort(function (a, b) {
			return new Date('1970/01/01 ' + a.from).getTime() - new Date('1970/01/01 ' + b.from).getTime();
		});
	}
}