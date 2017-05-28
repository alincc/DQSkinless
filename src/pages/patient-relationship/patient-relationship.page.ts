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

    public pRelForm: FormGroup;

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
    private pRel: string;

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
        this.pRel = this.params.get('pRel') ? this.params.get('pRel') : null;

        this.relationships = LOVS.PD_RELATIONSHIP;

        this.errors = {
            doctorName: '',
            relationship: ''
        }
    }

    public ngOnInit() {
        this.createpRelForm();
    }

    private createpRelForm() {
        this.pRelForm = this.formBuilder.group({
            doctorId: ['', Validators.required],
            doctorName: '',
            relationship: ['', Validators.required],
            expiry: ''
        });

        this.doctorId = this.pRelForm.get('doctorId');
        this.doctorName = this.pRelForm.get('doctorName');
        this.relationship = this.pRelForm.get('relationship');
        this.expiry = this.pRelForm.get('expiry');

        this.doctorId.valueChanges.subscribe(newValue => {
            this.errors.doctorId = this.doctorId.hasError('required') ? 'Doctor is required' : '';
        });

        this.relationship.valueChanges.subscribe(newValue => {
            this.errors.relationship = this.relationship.hasError('required') ? 'Relationship is required' : '';
        });

        console.log('this.pRel', this.pRel);
        this.relationship.setValue(this.pRel);
    }

    private markFormAsDirty() {
        Object.keys(this.pRelForm.controls).forEach(key => {
            this.pRelForm.get(key).markAsDirty();
        });
    }

    private validateForm() {
        this.errors.doctorId = this.doctorId.hasError('required') ? 'Doctor is required' : '';
        this.errors.relationship = this.relationship.hasError('required') ? 'Relationship is required' : '';
    }

    public submitForm(event) {
        this.markFormAsDirty();
        this.validateForm();

        if (this.pRelForm.valid) {

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

    public getMinDate() {
        return Utilities.getMinDate();
    }

    public clearDate(control) {
        control.setValue('');
    }
}
