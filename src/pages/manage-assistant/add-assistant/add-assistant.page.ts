import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'add-assistant-page',
    templateUrl: 'add-assistant.html'
})
export class AddAssistantPage {

    callback: Function;

    constructor(private nav: NavController,
        private params: NavParams) {
    }

    public submit(response) {
        this.callback = this.params.get('callback');
        this.callback(response).then(() => {
            this.nav.pop();
        });
    }
}