import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { RegistrationForm, Profile } from '../../../shared/model/registration.model';

import { PasswordGeneratorService } from '../../../utilities/password-generator.service';

@Component({
    selector: 'assistant-page',
    templateUrl: 'assistant.html'
})
export class AssistantPage {

    private callback: Function;

    public profile: Profile;
    public mode: string;

    constructor(
        private nav: NavController,
        private params: NavParams,
        private passwordGeneratorService: PasswordGeneratorService) {

        if (this.params.data) {
            this.profile = this.params.data.profile;
            this.mode = this.params.data.mode;
        }
    }

    public submit(response) {
        this.callback = this.params.get('callback');
        let registrationForm = new RegistrationForm();

        registrationForm.profile = response;
        // registrationForm.password = this.passwordGeneratorService.generatePassword();

        this.callback(registrationForm).then(() => {
            this.nav.pop();
        });
    }
}