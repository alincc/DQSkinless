import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavParams } from "ionic-angular";

import { AccountCreationModal } from '../../../components/account-creation-modal/account-creation-modal.component';
import { RootNavController } from '../../../services/services';
import { SearchUserModal } from '../../../components/search-user-modal/search-user-modal.component';

import { ClinicManagerService } from '../clinic-manager.service';

import { LOVS } from '../../../constants/constants';

@Component({
	selector: 'associate-member-page',
	templateUrl: 'associate-member.html',
	providers: [ClinicManagerService]
})
export class AssociateMemberPage implements OnInit {

	public members: any;
	public userId: any;
	public accessRole: any;
	public userRole: any;

	private clinicId: any;
	private loading: any;

	constructor(
		private params: NavParams,
		private root: RootNavController,
		private alertController: AlertController,
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
		this.userId = this.clinicManagerService.getUserId();
		this.accessRole = LOVS.ACCESS_ROLES;
		this.userRole = LOVS.USER_ROLES;
	}

	private getMembers() {
		this.showLoading();

		this.clinicManagerService.getClinicMember(this.clinicId).subscribe(response => {
			if (response && response.status) {
				this.members = response.result;
			}
			this.dismissLoading();
		}, err => this.dismissLoading());
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
		return (user.lastname ? user.lastname + ', ' : '') + (user.firstname ? user.firstname + ' ' : '') + ' ' + (user.middlename ? user.middlename : '');
	}

	public addAssistant() {
		let accountCreationModal = this.modalController.create(AccountCreationModal);

		accountCreationModal.present();

		accountCreationModal.onDidDismiss(newMember => {
			if (newMember) {
				this.clinicManagerService.associateMember(this.clinicId, newMember.userId, 0, 2).subscribe(response => {
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
				if (!this.userAlreadyExist(user.userId)) {
					this.clinicManagerService.associateMember(this.clinicId, user.userId, 0, user.userRole).subscribe(response => {
						if (response && response.status) {
							this.getMembers();
						}
					});
				} else {
					this.alertController.create({
						message: `${user.lastname ? this.getFullName(user) : user.email} is already in this clinic`,
						buttons: [
							{
								text: 'OK',
								role: 'cancel',
							}
						]
					}).present();
				}
			}
		});
	}

	private userAlreadyExist(userId) {
		return this.members.filter(member => { return member.userId === userId }).length > 0
	}

	public editRole(event, member) {
		// TODO
	}

	public deleteMember(member, mi) {
		this.alertController.create({
			message: `Remove ${this.getFullName(member)} from this clinic?`,
			buttons: [
				{
					text: 'NO',
					role: 'cancel',
				},
				{
					text: 'YES',
					handler: () => {
						this.showLoading();
						this.clinicManagerService.deleteClinicAccessByClinIdUserId(this.clinicId, member.userId).subscribe(response => {
							if (response && response.status) {
								this.members.splice(mi, 1);
							}
							this.dismissLoading();
						}, err => this.dismissLoading());
					}
				}
			]
		}).present();
	}
}