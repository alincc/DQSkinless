import { Component, OnInit } from '@angular/core';
import { AlertController, NavParams } from "ionic-angular";

import { RootNavController } from '../../services/services';

import { LOVS } from '../../constants/constants'

import { ClinicPage } from './clinic/clinic.page';

@Component({
	selector: 'clinic-manager-page',
	templateUrl: 'clinic-manager.html'
})
export class ClinicManagerPage implements OnInit {

	public allowableClinics: any;
	public clinics: any;

	public days: any;
	public contactType: any;

	constructor(
		private alertController: AlertController,
		private params: NavParams,
		private rootNav: RootNavController) {
		this.getDefaults();
	}

	public ngOnInit() {
		this.clinics = []; // TODO IMPLEMENTED CLINIC RETRIEVAL
		this.allowableClinics = this.clinics.length; // TODO BE FETCH FROM DB
	}

	private getDefaults() {
		this.days = LOVS.DAYS;
		this.contactType = LOVS.CONTACT_TYPE;
	}

	public addClinic() {
		this.rootNav.push(ClinicPage, {
			callback: this.addClinicCallBack,
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
					}
				}
			]
		}).present();
	}

	public viewClinic(clinic, i) {

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