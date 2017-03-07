import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ManagerPage } from '../../../pages/manager/manager.page';
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
        console.log ('upload photo api => ' + response);
        if (this.params.data) {
            this.params.data.parent.step = 4;
            if (this.params.data.isLoggedAsDoctor) {
                this.nav.setRoot(StepFourPage, this.params.data, { animate: true, direction: 'forward' });
            } else {
                this.parentNav.setRoot(ManagerPage);
            }
        }
    }
}