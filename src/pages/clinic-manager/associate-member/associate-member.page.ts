import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavParams } from "ionic-angular";

import { AccountCreationModal } from '../../../components/account-creation-modal/account-creation-modal.component';
import { AccessRoleModal } from '../../../components/access-role-modal/access-role-modal.component';
import { SearchUserModal } from '../../../components/search-user-modal/search-user-modal.component';

import { ClinicManagerService } from '../clinic-manager.service';
import { RootNavController, Storage } from '../../../services';
import { Utilities } from '../../../utilities/utilities';

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
	public accessRoles: any;
	public userRole: any;
	public isManager: boolean;

	private clinicId: any;
	private loading: any;

	constructor(
		private params: NavParams,
		private alertController: AlertController,
		private loadingController: LoadingController,
		private modalController: ModalController,
		private root: RootNavController,
		private storage: Storage,
		private clinicManagerService: ClinicManagerService) {
		this.getDefaults();
	}

	public ngOnInit() {
		this.getMembers();
	}

	private getDefaults() {
		this.clinicId = this.params.data && this.params.data.clinicId ? this.params.data.clinicId : null;
		this.isManager = this.params.data && this.params.data.isManager;
		this.accessRole = this.params.data && this.params.data.accessRole;
		this.userId = this.clinicManagerService.getUserId();
		this.accessRoles = LOVS.ACCESS_ROLES;
		this.userRole = LOVS.USER_ROLES;
		this.members = [];
	}

	private getMembers() {
		this.showLoading();
		this.clinicManagerService.getClinicMember(this.clinicId).subscribe(response => {
			if (response && response.status) {

				const me = response.result.find(m => m.userId === this.userId);
				this.members = response.result.filter(m => m.userId !== this.userId);
				this.members.splice(0, 0, me);
				this.formatMembersExpiryDate();
			}
			this.dismissLoading();
		}, err => this.dismissLoading());
	}

	private formatMembersExpiryDate() {
		this.members.forEach(member => {
			member.roleExpiryDate = member.roleExpiryDate ? Utilities.clearTime(new Date(+member.roleExpiryDate)) : '';
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

	public getDefaultAvatar(member) {
		if (member && member.lastname) {
			return member.lastname.substring(0, 1).toUpperCase() + member.firstname.substring(0, 1).toUpperCase();
		} else {
			return "?";
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
				this.clinicManagerService.associateMember(this.clinicId, newMember.userId, 2, 2).subscribe(response => {
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
					this.clinicManagerService.associateMember(this.clinicId, user.userId, 2, user.userRole).subscribe(response => {
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
		return this.members.filter(member => member.userId === userId).length > 0
	}

	public editAccess(member) {
		let accessRoleModal = this.modalController.create(AccessRoleModal, {
			member: {
				memberId: member.userId,
				clinicId: this.clinicId,
				accessRole: member.accessRole,
				roleExpiryDate: member.roleExpiryDate
			}
		});

		accessRoleModal.present();

		accessRoleModal.onDidDismiss(access => {
			if (access) {
				this.getMembers();
			}
		});
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