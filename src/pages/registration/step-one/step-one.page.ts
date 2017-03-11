import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { StepTwoPage } from '../step-two/step-two.page';

@Component({
    selector: 'step-one',
    templateUrl: 'step-one.html'
})
export class StepOnePage {

    private parentNav: NavController;

    constructor(private nav: NavController,
        private params: NavParams) {
        this.parentNav = params.data.parentNav;
        params.data.parent.step = 1;
    }

    public changePassword(response) {
        console.log ('change password api => ' + response);
        if (this.params.data) {
            this.params.data.parent.step = 2;
            this.nav.setRoot(StepTwoPage, this.params.data, { animate: true, direction: 'forward' });
        }
    }
}