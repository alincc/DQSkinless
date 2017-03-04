import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'search-assistant-page',
    templateUrl: 'search-assistant.html'
})
export class SearchAssistantPage {

    constructor(private nav: NavController,
        private params: NavParams) {
    }
}