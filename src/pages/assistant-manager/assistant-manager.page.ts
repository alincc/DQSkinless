import { Component, OnInit } from "@angular/core";
import { AlertController, ModalController, NavParams } from "ionic-angular";

import { RootNavController } from '../../services/services';

import { AccountCreationModal } from '../../components/account-creation-modal/account-creation-modal';
import { SearchUserModal } from '../../components/search-user-modal/search-user-modal';

import { AssistantManagerService } from './assistant-manager-service';

@Component({
	selector: 'assistant-manager-page',
	templateUrl: 'assistant-manager.html',
	providers: [AssistantManagerService]
})
export class AssistantManagerPage implements OnInit {

	public assistants: any;
	public isManager: boolean;

	constructor(
		private alertController: AlertController,
		private modalController: ModalController,
		private params: NavParams,
		private rootNav: RootNavController,
		private assistantManagerService: AssistantManagerService) {
		this.getDefaults();
	}

	private getDefaults() {
		this.assistants = [];

		this.isManager = this.params.data && this.params.data.isManager ? this.params.data.isManager : false;
	}

	public ngOnInit() {
		this.assistantManagerService.getAssistantsByClinic(this.rootNav.reloadPublisher.getValue()).subscribe(response => {
			if (response && response.status) {
				this.assistants = response.result;
			}
		});
	}

	public addAssistant() {
		let accountCreationModal = this.modalController.create(AccountCreationModal);

		accountCreationModal.present();

		accountCreationModal.onDidDismiss(assistant => {
			if (assistant) {
				this.assistantManagerService.associateMember(this.rootNav.reloadPublisher.getValue(), assistant.userId).subscribe(response => {
					if (response && response.status) {
						this.assistants.push(assistant);
					}
				});
			}
		});
	}

	public getFullName(user) {
        return (user.lastname ? user.lastname + ', ' : '') + user.firstname + ' ' + (user.middlename ? user.middlename : '');
    }

    public displayContacts(contacts) {
		if (contacts && contacts.length > 0) {
			let formattedContacts = '';

			contacts.forEach(contact => {
				formattedContacts += `${contact.contact}, `;
			});
			return formattedContacts.substring(1, formattedContacts.length - 2);
		}
		return '';
	}
}