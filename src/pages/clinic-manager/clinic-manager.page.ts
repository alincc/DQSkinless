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
		this.getClinics();

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

	private getClinics() {
		this.clinics = [];

		this.clinicManagerService.getClinicRecord().subscribe(response => {
			if (response) {
				console.log('getClinics', response);
				this.clinics = response;
			}
		});
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
		this.index = index;
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
						this.clinicManagerService.deleteClinic(clinic.clinicId).subscribe(response => {
							if (response && response.status) {
								this.clinics.splice(i, 1);
							}
						})

						if (this.params.data.parent.completedRegistration && this.clinics.length === 0) {
							this.params.data.parent.completedRegistration = false;
						}
					}
				}
			]
		}).present();
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