import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { MOCK_ASSISTANTS } from './seacrh-assistant.mock';

@Component({
    selector: 'search-assistant-page',
    templateUrl: 'search-assistant.html',
    providers: [MOCK_ASSISTANTS],
})
export class SearchAssistantPage {

    public mockAssistants: any;

    constructor(private nav: NavController,
        private params: NavParams,
        private mock: MOCK_ASSISTANTS) {

        this.mockAssistants = this.mock.mockAssistants;
    }

    public search(event) {
        const searchedValue = event.target.value.toLowerCase();
        if (searchedValue && searchedValue !== '') {
            this.mockAssistants = this.mockAssistants.filter(mock => { 
                return mock.profile.fullName.toLowerCase().indexOf(searchedValue) !== -1;  });
        } else {
            this.mockAssistants = this.mock.mockAssistants;
        }
    }
}