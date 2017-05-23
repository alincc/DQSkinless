import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavParams } from 'ionic-angular';
import { RootNavController } from '../../services';
import { LOVS } from '../../constants/constants';
import { Utilities } from '../../utilities/utilities';

@Component({
    selector: 'patient-doctor-relationship-page',
    templateUrl: 'patient-doctor-relationship.html'
})
export class PatientDoctorRelationshipPage implements OnInit {

    public pdForm: FormGroup;

    public relationships: any;
    public errors: any;
    public pageHeader: string;

    private doctorId: AbstractControl;
    private relationship: AbstractControl;

    private patiendId: any;

    constructor(
        private formBuilder: FormBuilder,
        private params: NavParams,
        private rootNav: RootNavController) {
        this.getDefaults();
    }

    private getDefaults() {
        this.pageHeader = this.params.get('pageHeader') ? this.params.get('pageHeader') : 'Patient Doctor Relationship';
        this.patiendId = this.params.get('patiendId') ? this.params.get('patiendId') : null;

        this.relationships = LOVS.PD_RELATIONSHIP;

        this.errors = {
            doctorId: '',
            relationship: ''
        }
    }

    public ngOnInit() {
        this.createPdForm();
    }

    private createPdForm() {
        this.pdForm = this.formBuilder.group({
            doctorId: '',
            relationship: '',
            expiry: ''
        });
    }

    private markFormAsDirty() {
        Object.keys(this.pdForm.controls).forEach(key => {
            this.pdForm.get(key).markAsDirty();
        });
    }

    public submitForm(event) {

        // TODO saving

        this.markFormAsDirty();

        this.rootNav.pop();
        event.dismissLoading();
    }

    public getMinDate(): any {
        let dateNow = Utilities.clearTime(new Date());
        dateNow.setDate(dateNow.getDate() + 1);
        const month = dateNow.getMonth().toString();
        return dateNow.getFullYear() + '-' + (month.length < 2 ? '0' : '') + month + '-' + dateNow.getDate();
    }
}
