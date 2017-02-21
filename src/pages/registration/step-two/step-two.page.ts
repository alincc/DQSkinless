import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ManagerPage } from '../../../pages/manager/manager.page';

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
            // TODO refactoring
            // this.params.data.parent.step = 2;
            // this.nav.setRoot(ProfileForm, this.params.data, { animate: true, direction: 'forward' });
            this.parentNav.setRoot(ManagerPage);
        }
    }
}