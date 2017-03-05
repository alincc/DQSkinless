import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { StepFourPage } from '../step-four/step-four.page';

@Component({
    selector: 'step-three',
    templateUrl: 'step-three.html'
})
export class StepThreePage {

    private parentNav: NavController;

    constructor(private nav: NavController,
        private params: NavParams) {
             this.parentNav = params.data.parentNav;
            params.data.parent.step = 3;
    }

    public submit(response) {
        if (this.params.data) {            
            this.params.data.parent.step = 4;
            this.params.data.registrationData.photo = response;
            console.log('registration data=>' + JSON.stringify(this.params.data.registrationData));
            this.nav.setRoot(StepFourPage, this.params.data, { animate: true, direction: 'forward' });
        }
    }
}