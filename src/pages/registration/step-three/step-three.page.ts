import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ManagerPage } from '../../../pages/manager/manager.page';
import { StepFourPage } from '../step-four/step-four.page';

import { RootNavController } from '../../../services/services';

@Component({
    selector: 'step-three',
    templateUrl: 'step-three.html'
})
export class StepThreePage {

    private parentNav: NavController;

    constructor(
        private nav: NavController,
        private params: NavParams,
        private rootNav: RootNavController) {
        this.parentNav = nav;
        params.data.parent.step = 3;
    }

    public submit(response) {
        if (this.params.data) {
            this.params.data.parent.step = 4;
            if (this.params.data.isLoggedAsDoctor) {
                this.parentNav.setRoot(StepFourPage, this.params.data, { animate: true, direction: 'forward' });
            } else {
                this.rootNav.push(ManagerPage);
            }
        }
    }
}