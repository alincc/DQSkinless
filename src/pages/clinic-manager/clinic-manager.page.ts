import { Component, OnInit } from '@angular/core';
import { AlertController, NavParams } from "ionic-angular";

import { RootNavController } from '../../services/services';

@Component({
	selector: 'clinic-manager-page',
	templateUrl: 'clinic-manager.html'
})
export class ClinicPage implements OnInit {

	public allowableClinics: any;
	public clinics: any;

	constructor(
		private alertController: AlertController,
		private params: NavParams,
		private rootNav: RootNavController) {
		if (this.params.data) {
			params.data.parent.step = 4;
			this.params.data.parent.completedRegistration = true; //TEMP
		}
	}

	public ngOnInit() {
		this.clinics = []; // TODO IMPLEMENTED CLINIC RETRIEVAL

		const clinic = {
			name: 'test clinic',
			address: 'test address',
			schedules: [{
				day: 'monday',
				time: [
					{
						from: '3:00 pm',
						to: '5:00 pm'
					},
					{
						from: '9:00 am',
						to: '11:00 am'
					},
					{
						from: '1:00 pm',
						to: '2:00 pm'
					}
				]

			},
			{
				day: 'wednesday',
				time: [{
					from: '1:00 pm',
					to: '5:00 pm'
				}]
			}],
			contacts: [
				{
					type: '0',
					contact: 'test@test.com'
				},
				{
					type: '1',
					contact: '9111111'
				}
			]
		};

		const clinic2 = {
			name: 'test clinic2',
			address: 'test address2',
			schedules: [{
				day: 'tuesday',
				time: [{
					from: '3:00 pm',
					to: '5:00 pm'
				}]
			},
			{
				day: 'sunday',
				time: [{
					from: '1:00 pm',
					to: '5:00 pm'
				}]
			}],
			contacts: [
				{
					type: '0',
					contact: 'test@test.com'
				},
				{
					type: '1',
					contact: '8700000'
				}
			]
		};

		this.clinics.push(clinic);
		this.clinics.push(clinic2);

		this.allowableClinics = this.clinics.length; // TODO BE FETCH FROM DB
		console.log(this.clinics.length);
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

	private sortContactType(contacts) {
		return contacts.sort(function (a, b) {
			return new Date(a.type - b.type);
		});
	}

	public addClinic() {

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
}