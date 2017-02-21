import { Component, Output, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AddAssistantPage } from './add-assistant/add-assistant.page';

@Component({
    selector: 'manage-assistant-page',
    templateUrl: 'manage-assistant.html'
})
export class ManageAssistantPage {

    @Output() onSubmit = new EventEmitter();

    allowableAssistants: number;
    assistants: any[];

    constructor(public nav: NavController) {
        this.allowableAssistants = 1;
        this.assistants = [];
        console.log('test'+ this.assistants.length);
    }

    submitForm() {
        console.log('hey!');
        this.onSubmit.emit('Registration Done');
    }

    addAssistant() {
        this.nav.push(AddAssistantPage, {
            callback: this.addAssistantCallBack
        });
    }

    addAssistantCallBack = (params) => {
        return new Promise((resolve, reject) => {

            this.assistants = new Array(this.allowableAssistants);
            this.assistants[0] = params.lastName + ',' + params.firstName + ' ' + params.middleName;
            this.allowableAssistants--;
            resolve();
        });
    }
}