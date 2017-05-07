import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavParams } from "ionic-angular";

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
	public userId: any;

	private clinicId: any;
	private loading: any;

	constructor(
		private params: NavParams,
		private root: RootNavController,
		private loadingController: LoadingController,
		private modalController: ModalController,
		private clinicManagerService: ClinicManagerService) {
		this.getDefaults();
	}

	public ngOnInit() {
		this.getMembers();
	}

	private getDefaults() {
		this.clinicId = this.params.data && this.params.data.clinicId ? this.params.data.clinicId : null;
		this.members = [];
		this.userId = this.clinicManagerService.getUserId();
	}

	private getMembers() {
		this.showLoading();

		this.clinicManagerService.getClinicMember(this.clinicId).subscribe(response => {
			if (response && response.status) {
				this.members = response.result;
			}
			this.dismissLoading();
		});
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

	public getFullName(user) {
		return (user.lastname ? user.lastname + ', ' : '') + user.firstname + ' ' + (user.middlename ? user.middlename : '');
	}

	public addAssistant() {
		let accountCreationModal = this.modalController.create(AccountCreationModal);

		accountCreationModal.present();

		accountCreationModal.onDidDismiss(newMember => {
			if (newMember) {
				this.clinicManagerService.associateMember(this.root.reloadPublisher.getValue(), newMember.userId, 1, 2).subscribe(response => {
					if (response && response.status) {
						this.getMembers();
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

		searchUserModal.onDidDismiss(user => {
			if (user) {
				// TODO set user role
				this.clinicManagerService.associateMember(this.clinicId, user.userId, 1, 1).subscribe(response => {
					if (response && response.status) {
						this.getMembers();
					}
				});
			}
		});
	}

	public editRole(event, member) {
		// TODO
	}

	public deleteMember(event, member) {
		// TODO
	}
}