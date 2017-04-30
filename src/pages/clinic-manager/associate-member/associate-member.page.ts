import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams } from "ionic-angular";

import { RootNavController } from '../../services/services';
import { SearchUserModal } from '../../../components/search-user-modal/search-user-modal';

import { ClinicManagerService } from '../clinic-manager.service';

@Component({
	selector: 'associate-member-page',
	templateUrl: 'associate-member.html',
	providers: [ClinicManagerService]
})
export class AssociateMemberPage implements OnInit {

	public assistants: any;

	private clinicId: any;

    constructor(private clinicManagerService: ClinicManagerService,
    	private params: NavParams,
    	private modalController: ModalController) {
    	this.clinicId = this.params.data && this.params.data.clinicId ? this.params.data.clinicId : null;
    	this.assistants = [];
    }

    public ngOnInit() {
    	this.clinicManagerService.getAssistantsByClinic(this.clinicId).subscribe(response => {
			if (response && response.status) {
				this.assistants = response.result;
			}
		});
    }

    public addAssistant() {
		let accountCreationModal = this.modalController.create(SearchUserModal, {
			message: 'Associate',
			role: 2
		});

		accountCreationModal.present();

		accountCreationModal.onDidDismiss(assistant => {
			if (assistant) {
				this.clinicManagerService.associateMember(this.clinicId	, assistant.userId).subscribe(response => {
					if (response && response.status) {
						this.assistants.push(assistant);
					}
				});
			}
		});
	}
}