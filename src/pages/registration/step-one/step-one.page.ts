import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProfileForm } from '../../profile/form/profile.form';

@Component({
    selector: 'step-one',
    templateUrl: 'step-one.html'
})
export class StepOnePage {

    constructor(private nav: NavController,
        private params: NavParams) {
            params.data.parent.step = 1;
    }

    public changePassword(response) {
        if (this.params.data) {
            this.params.data.parent.step = 2;
            // TODO refactoring
            this.nav.setRoot(ProfileForm, this.params.data, { animate: true, direction: 'forward' });
        }
    }
}