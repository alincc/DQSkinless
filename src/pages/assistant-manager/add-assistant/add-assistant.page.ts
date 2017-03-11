import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { RegistrationForm } from '../../../shared/model/registration.model';

import { PasswordGeneratorService } from '../../../utilities/password-generator.service';

@Component({
    selector: 'add-assistant-page',
    templateUrl: 'add-assistant.html'
})
export class AddAssistantPage {

    private callback: Function;

    constructor(
        private nav: NavController,
        private params: NavParams,
        private passwordGeneratorService: PasswordGeneratorService) {
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