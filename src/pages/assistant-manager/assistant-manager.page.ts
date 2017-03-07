import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";

import { AddAssistantPage } from './add-assistant/add-assistant.page';
import { SearchAssistantPage } from './search-assistant/search-assistant.page';

import { RegistrationForm } from '../../shared/model/registration.model';

@Component({
	selector: 'assistant-manager-page',
	templateUrl: 'assistant-manager.html'
})
export class AssistantManagerPage {

	allowableAssistants: number;
	assistants: RegistrationForm[];

	constructor(private nav: NavController,
		private params: NavParams) {
		this.allowableAssistants = 1;
		this.assistants = [];
	}

	addAssistant() {
		this.nav.push(AddAssistantPage, {
			callback: this.addAssistantCallBack
		});
	}

	addAssistantCallBack = (params) => {
		return new Promise((resolve, reject) => {
			this.assistants.push(params);
			this.allowableAssistants--;

			if (this.params.data.parent) {
				this.params.data.parent.completedRegistration = true;
			}
			
			resolve();
		});
	}

	searchAssistant() {
		this.nav.push(SearchAssistantPage, {
			callback: this.searchAssistantCallBack
		});
	}

	searchAssistantCallBack = (params) => {
		return new Promise((resolve, reject) => {

			resolve();
		});
	}

}