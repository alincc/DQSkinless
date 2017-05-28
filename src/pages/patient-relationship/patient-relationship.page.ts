import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, NavParams } from 'ionic-angular';

import { RootNavController } from '../../services';
import { PatientRelationshipService } from './patient-relationship.service';

import { LOVS } from '../../constants/constants';
import { Utilities } from '../../utilities/utilities';

import { SearchUserModal } from '../../components/search-user-modal/search-user-modal.component';

@Component({
    selector: 'patient-relationship-page',
    templateUrl: 'patient-relationship.html',
    providers: [PatientRelationshipService]
})
export class PatientRelationshipPage implements OnInit {

    public pdForm: FormGroup;

    public relationships: any;
    public allowableRelationships: any;
    public errors: any;
    public pageHeader: string;

    private doctorId: AbstractControl;
    private doctorName: AbstractControl;
    private relationship: AbstractControl;
    private expiry: AbstractControl;

    private loading: any;
    private patiendId: any;

    constructor(
        private formBuilder: FormBuilder,
        private loadingController: LoadingController,
        private modalController: ModalController,
        private params: NavParams,
        private rootNav: RootNavController,
        private patientRelationshipService: PatientRelationshipService) {
        this.getDefaults();
    }

    private getDefaults() {
        this.pageHeader = this.params.get('pageHeader') ? this.params.get('pageHeader') : 'Patient Doctor Relationship';
        this.patiendId = this.params.get('patiendId') ? this.params.get('patiendId') : null;

        this.relationships = LOVS.PD_RELATIONSHIP;
        this.allowableRelationships = LOVS.ALLOWABLE_PD_REL;

        this.errors = {
            doctorName: '',
            relationship: ''
        }
    }

    public ngOnInit() {
        this.createPdForm();
    }

    private createPdForm() {
        this.pdForm = this.formBuilder.group({
            doctorId: ['', Validators.required],
            doctorName: '',
            relationship: ['', Validators.required],
            expiry: ''
        });

        this.doctorId = this.pdForm.get('doctorId');
        this.doctorName = this.pdForm.get('doctorName');
        this.relationship = this.pdForm.get('relationship');
        this.expiry = this.pdForm.get('expiry');

        this.doctorId.valueChanges.subscribe(newValue => {
            this.errors.doctorId = this.doctorId.hasError('required') ? 'Doctor is required' : '';
        });

        this.relationship.valueChanges.subscribe(newValue => {
            this.errors.relationship = this.relationship.hasError('required') ? 'Relationship is required' : '';
        });
    }

    private markFormAsDirty() {
        Object.keys(this.pdForm.controls).forEach(key => {
            this.pdForm.get(key).markAsDirty();
        });
    }

    private validateForm() {
        this.errors.doctorId = this.doctorId.hasError('required') ? 'Doctor is required' : '';
        this.errors.relationship = this.relationship.hasError('required') ? 'Relationship is required' : '';
    }

    public submitForm(event) {
        this.markFormAsDirty();
        this.validateForm();

        if (this.pdForm.valid) {

            const payload = {
                userId: this.doctorId.value,
                patientId: this.patiendId,
                startDate: null,
                endDate: this.expiry.value,
                access: this.relationship.value
            };

            console.log(payload);
            // TODO
            // this.sharePatientService.createPatientAccess(payload).subscribe(response => {
            //     if (response && response.status) {

            //     }

            //     event.dismissLoading();
            // }, err => event.dismissLoading());

            event.dismissLoading();
            this.rootNav.pop();
        } else {
            event.dismissLoading();
        }
    }

    public searchUser() {
        let searchUserModal = this.modalController.create(SearchUserModal);

        searchUserModal.present();

        searchUserModal.onDidDismiss(user => {
            this.doctorName.markAsDirty();

            if (user) {
                this.doctorId.setValue(user.userId);
                this.doctorName.setValue(this.getFullName(user));
            }
        });
    }

    private getFullName(user) {
        return Utilities.getFullName(user);
    }

    public getMinDate(): any {
        return Utilities.getMinDate();
    }
}
