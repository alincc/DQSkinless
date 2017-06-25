import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { PatientListService } from './patient-list.service';

@Component({
    selector: 'patient-list',
    templateUrl: 'patient-list.html',
    providers: [PatientListService]
})
export class PatientList {

    public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor() { }
}
