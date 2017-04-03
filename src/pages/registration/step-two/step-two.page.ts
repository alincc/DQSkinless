import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { StepThreePage } from '../step-three/step-three.page';

@Component({
    selector: 'step-two',
    templateUrl: 'step-two.html'
})
export class StepTwoPage {

    private parentNav: NavController;

    public formType: string;

    constructor(
        private params: NavParams) {
        this.parentNav = params.data.parentNav;
        this.formType = params.data.isLoggedAsDoctor ? 'doctor' : 'nonDoctor';
        params.data.parent.step = 2;
    }

    public moveToNext(response) {
        if (this.params.data) {
            this.params.data.parent.step = 3;
            this.parentNav.setRoot(StepThreePage, this.params.data, { animate: true, direction: 'forward' });
        }
    }
}