import { Component } from "@angular/core";
import { AlertController, NavController, NavParams } from "ionic-angular";

import { AssistantPage } from './assistant/assistant.page';
import { SearchAssistantPage } from './search-assistant/search-assistant.page';

import { RegistrationForm, Profile } from '../../shared/model/registration.model';

@Component({
	selector: 'assistant-manager-page',
	templateUrl: 'assistant-manager.html'
})
export class AssistantManagerPage {

	public allowableAssistants: number;
	public assistants: RegistrationForm[];
	private index: number;

	constructor(
		private alertController: AlertController,
		private nav: NavController,
		private params: NavParams) {
		this.allowableAssistants = 2;
		this.assistants = [];
	}

	public addAssistant() {
		this.nav.push(AssistantPage, {
			callback: this.addAssistantCallBack,
			profile: new Profile(),
			mode: 'Add',
			usage: 'account'
		});
	}

	public searchAssistant() {
		this.nav.push(SearchAssistantPage, {
			callback: this.searchAssistantCallBack
		});
	}

	public deleteAssistant(assistant, i) {
		this.alertController.create({
			message: `Delete ${assistant.profile.fullName} as assistant?`,
			buttons: [
				{
					text: 'NO',
					role: 'cancel',
				},
				{
					text: 'YES',
					handler: () => {
						this.assistants.splice(i, 1);
						this.allowableAssistants++;
					}
				}
			]
		}).present();
	}

	// public editAssistant(assistant, i) {
	// 	this.index = i;
	// 	this.nav.push(AssistantPage, {
	// 		callback: this.editAssistantCallBack,
	// 		profile: assistant.profile,
	// 		mode: 'Edit'
	// 	});
	// }

	public viewAssistant(assistant) {
		this.nav.push(AssistantPage, {
			profile: assistant.profile,
			mode: 'View',
			usage: 'profile'
		});
	}

	public addAssistantCallBack = (params) => {
		return new Promise((resolve, reject) => {
			this.assistants.push(params);
			this.allowableAssistants--;

			if (this.params.data.parent) {
				this.params.data.parent.completedRegistration = true;
			}

			resolve();
		});
	}

	// public editAssistantCallBack = (params) => {
	// 	return new Promise((resolve, reject) => {
	// 		if (this.index !== undefined){
	// 			this.assistants[this.index] = params;
	// 		}
	// 		resolve();
	// 	});
	// }

	public searchAssistantCallBack = (params) => {
		return new Promise((resolve, reject) => {

			this.assistants.push(params);
			this.allowableAssistants--;

			if (this.params.data.parent) {
				this.params.data.parent.completedRegistration = true;
			}

			resolve();
		});
	}

}