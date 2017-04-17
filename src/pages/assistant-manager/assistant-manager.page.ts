import { Component, OnInit } from "@angular/core";
import { AlertController, ModalController } from "ionic-angular";

import { RootNavController } from '../../services/services';

import { AccountCreationModal } from '../../components/account-creation-modal/account-creation-modal';
import { SearchUserModal } from '../../components/search-user-modal/search-user-modal';

@Component({
	selector: 'assistant-manager-page',
	templateUrl: 'assistant-manager.html'
})
export class AssistantManagerPage implements OnInit {

	public allowableAssistants: number;
	public assistants: any;

	constructor(
		private alertController: AlertController,
		private modalController: ModalController,
		private rootNav: RootNavController) {
		this.getDefaults();
	}

	private getDefaults() {
		this.assistants = [];
	}

	public ngOnInit() {
		// TODO GET ASSISTANTS
	}

	public addAssistant() {
		let accountCreationModal = this.modalController.create(AccountCreationModal);

		accountCreationModal.present();

		accountCreationModal.onDidDismiss(assistant => {
			if (assistant) {
				console.log('assistant =>' + JSON.stringify(assistant));
				this.assistants.push(assistant);
			}
		});
	}

	public searchAssistant() {
		let searchAssistantModal = this.modalController.create(SearchUserModal);

		searchAssistantModal.present();

		searchAssistantModal.onDidDismiss(assistant => {
			if (assistant) {
				console.log('assistant =>' + JSON.stringify(assistant));
			}
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
}