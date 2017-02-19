import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ManagerPage } from '../../manager/manager.page';

@Component({
    selector: 'assistant-form',
    templateUrl: 'assistant.html'
})
export class AssistantForm {
    constructor(private nav: NavController,
        private params: NavParams) {

    }

    public submit() {
        this.nav.push(ManagerPage);
    }
}