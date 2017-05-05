import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from "ionic-angular";

import { AccountCreationModal } from '../../../components/account-creation-modal/account-creation-modal';
import { RootNavController } from '../../../services/services';
import { SearchUserModal } from '../../../components/search-user-modal/search-user-modal';

import { ClinicManagerService } from '../clinic-manager.service';

@Component({
	selector: 'associate-member-page',
	templateUrl: 'associate-member.html',
	providers: [ClinicManagerService]
})
export class AssociateMemberPage implements OnInit {

	public members: any;

	private clinicId: any;

	constructor(
		private params: NavParams,
		private root: RootNavController,
		private modalController: ModalController,
		private clinicManagerService: ClinicManagerService) {
		this.getDefaults();
	}

	public ngOnInit() {
		this.clinicManagerService.getClinicMember(this.clinicId).subscribe(response => {
			if (response && response.status) {
				this.members = response.result;
			}
		});
	}

	private getDefaults() {
		this.clinicId = this.params.data && this.params.data.clinicId ? this.params.data.clinicId : null;
		this.members = [];
	}

	public getFullName(user) {
		return (user.lastname ? user.lastname + ', ' : '') + user.firstname + ' ' + (user.middlename ? user.middlename : '');
	}

	public addAssistant() {
		let accountCreationModal = this.modalController.create(AccountCreationModal);

		accountCreationModal.present();

		accountCreationModal.onDidDismiss(newMember => {
			if (newMember) {
				this.clinicManagerService.associateMember(this.root.reloadPublisher.getValue(), newMember.userId).subscribe(response => {
					if (response && response.status) {
						this.members.push(newMember);
					}
				});
			}
		});
	}

	public searchUser() {
		let searchUserModal = this.modalController.create(SearchUserModal, {
			message: 'Associate'
		});

		searchUserModal.present();

		searchUserModal.onDidDismiss(assistant => {
			if (assistant) {
				this.clinicManagerService.associateMember(this.clinicId, assistant.userId).subscribe(response => {
					if (response && response.status) {
						this.members.push(assistant);
					}
				});
			}
		});
	}

	public deleteMember(event, member) {
		
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