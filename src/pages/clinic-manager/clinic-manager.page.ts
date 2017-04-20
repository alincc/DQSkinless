import { Component, OnInit } from '@angular/core';
import { AlertController, NavParams } from "ionic-angular";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';

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

		this.clinicManagerService.getClinicAccessByUserId().flatMap(response => {
			if (response) {
				return Observable.of(response);
			}
		}).subscribe(response => {
			if (response && response.status) {
				response.result.forEach(result => {
					let clinic = {
						clinicId: '',
						clinicName: '',
						address: '',
						contacts: [],
						schedules: []
					};

					this.clinicManagerService.getClinicRecordById(result.clinicId).flatMap(response => {

						if (response && response.status) {
							clinic.clinicId = response.result.clinicId;
							clinic.clinicName = response.result.clinicName;
							clinic.address = response.result.address;

							return Observable.of(response);
						}

						return Observable.of(response);
					}).flatMap(response => {
						if (response && response.status) {
							this.clinicManagerService.getUserContacts().subscribe(response => {
								if (response && response.status) {
									response.result.forEach(contact => {
										clinic.contacts.push({
											contactType: contact.contactType,
											contact: contact.contact,
											isProfileContacts: true
										});
									});

									return Observable.of(response);
								}

								return Observable.of(response);
							});
						}

						return Observable.of(response);
					}) // TODO RETRIEVAL OF TIMESLOT/CONTACT
						.subscribe(() => {
							this.clinics.push(clinic);
						});
				});
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
						this.clinicManagerService.deleteClinicDetailRecord(clinic.clinicId).subscribe(response => {
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