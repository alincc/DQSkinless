import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { StepTwoPage } from '../step-two/step-two.page';

import { RegistrationService } from '../registration.service';


@Component({
    selector: 'step-four',
    templateUrl: 'step-four.html'
})
export class StepFourPage {

    constructor(
        private nav: NavController,
        private params: NavParams,
        private registrationService: RegistrationService) {
        params.data.parent.step = 4;
    }
}