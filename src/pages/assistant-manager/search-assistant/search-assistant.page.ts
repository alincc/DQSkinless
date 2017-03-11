import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';

import { RegistrationForm } from '../../../shared/model/registration.model';

import { MOCK_ASSISTANTS } from './seacrh-assistant.mock';

@Component({
    selector: 'search-assistant-page',
    templateUrl: 'search-assistant.html',
    providers: [MOCK_ASSISTANTS],
})
export class SearchAssistantPage {

    public mockAssistants: RegistrationForm[];
    private callback: Function;

    constructor(
        private alertController: AlertController,
        private nav: NavController,
        private params: NavParams,
        private mock: MOCK_ASSISTANTS) {

        this.mockAssistants = this.mock.mockAssistants;
    }

    public search(event) {
        const searchedValue = event.target.value.toLowerCase();
        if (searchedValue && searchedValue !== '') {
            this.mockAssistants = this.mockAssistants.filter(mock => {
                return mock.profile.fullName.toLowerCase().indexOf(searchedValue) !== -1;
            });
        } else {
            this.mockAssistants = this.mock.mockAssistants;
        }
    }

    public selectAssistant(assistant: RegistrationForm) {
        this.alertController.create({
            message: `Add ${assistant.profile.fullName} as assistant?`,
            buttons: [
                {
                    text: 'NO',
                    role: 'cancel',
                },
                {
                    text: 'YES',
                    handler: () => {
                        this.addAssistant(assistant);
                    }
                }
            ]
        }).present();
    }

    private addAssistant(assistant) {
        this.callback = this.params.get('callback');
        this.callback(assistant).then(() => {
            this.nav.pop();
        });
    }
}