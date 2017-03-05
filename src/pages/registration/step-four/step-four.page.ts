import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ManagerPage } from '../../../pages/manager/manager.page';

@Component({
    selector: 'step-four',
    templateUrl: 'step-four.html'
})
export class StepFourPage {

    private parentNav: NavController;

    constructor(private nav: NavController,
        private params: NavParams) {
             this.parentNav = params.data.parentNav;
            params.data.parent.step = 4;
    }

    public submit(response) {
        if (this.params.data) {
            this.parentNav.setRoot(ManagerPage);
        }
    }
}