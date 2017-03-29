import { Component } from '@angular/core';

import { ManagerPage } from '../../../pages/manager/manager.page';

import { RootNavController } from '../../../services/services';

@Component({
    selector: 'step-four',
    templateUrl: 'step-four.html'
})
export class StepFourPage {

    constructor(private rootNav: RootNavController) { }
    
}