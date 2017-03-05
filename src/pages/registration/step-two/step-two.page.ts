import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { StepThreePage } from '../step-three/step-three.page';

@Component({
    selector: 'step-two',
    templateUrl: 'step-two.html'
})
export class StepTwoPage {

    private parentNav: NavController;

    constructor(private nav: NavController,
        private params: NavParams) {
        this.parentNav = params.data.parentNav;
        params.data.parent.step = 2;
    }

    public submit(response) {
        if (this.params.data) {
            console.log(response);
            this.params.data.parent.step = 3;
            this.params.data.registrationData.profile = response;
            console.log('registration data=>' + JSON.stringify(this.params.data.registrationData));
            this.nav.setRoot(StepThreePage, this.params.data, { animate: true, direction: 'forward' });
        }
    }
}