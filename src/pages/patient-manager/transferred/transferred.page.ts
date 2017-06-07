import { Component } from '@angular/core';
import { NavParams } from "ionic-angular";

import { PatientRelationshipPage } from '../../patient-relationship/patient-relationship.page';

import { RootNavController } from '../../../services';
import { PatientManagerService } from '../patient-manager.service';

@Component({
    selector: 'transferred',
    templateUrl: 'transferred.html',
    providers: [PatientManagerService]
})
export class TransferredPage {

    public transferredList: any;

    private patiendId: any;

    constructor(
        private rootNav: RootNavController,
        private params: NavParams,
        private patientManagerService: PatientManagerService) {
        this.getDefaults();
    }

    private getDefaults() {
        this.patiendId = this.params.get('patiendId') ? this.params.get('patiendId') : null;
        this.transferredList = [];
    }

    public transferPatient() {
        this.rootNav.push(PatientRelationshipPage, {
            patiendId: this.patiendId,
            pRel: 2,
            pageHeader: 'Transfer Patient'
        });
    }
}