import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { RegistrationForm, Profile } from '../../../shared/model/registration.model';

@Component({
    selector: 'assistant-page',
    templateUrl: 'assistant.html'
})
export class AssistantPage {

    private callback: Function;

    public profile: Profile;
    public mode: string;
    public usage: string;

    constructor(
        private nav: NavController,
        private params: NavParams) {

        if (this.params.data) {
            this.profile = this.params.data.profile;
            this.mode = this.params.data.mode;
            this.usage = this.params.data.usage;
        }
    }

    public submit(response) {
        this.callback = this.params.get('callback');
        let registrationForm = new RegistrationForm();

        registrationForm.profile = response;

        this.callback(registrationForm).then(() => {
            this.nav.pop();
        });
    }
}