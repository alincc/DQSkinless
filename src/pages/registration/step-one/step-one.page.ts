import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { StepTwoPage } from '../step-two/step-two.page';

import { RegistrationService } from '../registration.service';

@Component({
    selector: 'step-one',
    templateUrl: 'step-one.html',
    providers: [RegistrationService]
})
export class StepOnePage {

    private parentNav: NavController;

    constructor(
        private nav: NavController,
        private params: NavParams,
        private registrationService: RegistrationService) {
        this.parentNav = nav;
        params.data.parent.step = 1;
    }

    public moveToNext(changePasswordFormValue) {
        if (this.params.data) {
            this.params.data.parent.step = 2;
        }

        this.parentNav.setRoot(StepTwoPage, this.params.data, { animate: true, direction: 'forward' });
    }
}