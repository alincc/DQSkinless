import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'step-four',
    templateUrl: 'step-four.html'
})
export class StepFourPage {

    constructor(
        private nav: NavController,
        private params: NavParams) {
        params.data.parent.step = 4;
    }
}