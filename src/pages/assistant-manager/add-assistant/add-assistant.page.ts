import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { RegistrationData } from '../../../shared/model/registration.model';

import { PasswordGeneratorService } from '../../../utilities/password-generator.service';

@Component({
    selector: 'add-assistant-page',
    templateUrl: 'add-assistant.html'
})
export class AddAssistantPage {

    callback: Function;

    constructor(
        private nav: NavController,
        private params: NavParams,
        private passwordGeneratorService: PasswordGeneratorService) {
    }

    public submit(response) {
        this.callback = this.params.get('callback');
        let registrationData = new RegistrationData();

        registrationData.profile = response;
        registrationData.password = this.passwordGeneratorService.generatePassword();
        
        this.callback(registrationData).then(() => {
            this.nav.pop();
        });
    }
}