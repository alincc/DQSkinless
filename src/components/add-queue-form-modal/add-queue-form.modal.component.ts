import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QUEUE } from '../../constants/constants'
import { Utilities } from '../../utilities/utilities';
@Component({
    selector: 'add-queue-form-modal',
    templateUrl: 'add-queue-form-modal.html'
})
export class AddQueueFormModal {
    private queueForm: FormGroup;
    private lastName: string;
    private firstName: string;
    private middleName: string;
    private isServeNow: AbstractControl;
    private schedule: AbstractControl;
    private timeSlot: AbstractControl;
    private errors: any;
    private forAsst: AbstractControl;
    private forDoctor: AbstractControl;
    private doctorRequested : AbstractControl;

    constructor(private formBuilder: FormBuilder,
        private view: ViewController,
        private param: NavParams) {
        this.initFormGroup(param.data);
    }

    private initFormGroup(data?) {
        this.lastName = data.lastname;
        this.firstName = data.firstname;
        this.middleName = data.middlename;

        this.queueForm = this.formBuilder.group({
            isServeNow: [data.type ? (data.type === QUEUE.TYPE.WALKIN ? true : false) : true],
            schedule: [data.schedule || new Date()],
            timeSlot: [data.timeSlot || new Date()],
            forAsst: [false],
            forDoctor : [false],
            doctorRequested : [0]
        });

        this.isServeNow = this.queueForm.get('isServeNow');
        this.schedule = this.queueForm.get('schedule');
        this.timeSlot = this.queueForm.get('timeSlot');
        this.forAsst = this.queueForm.get('forAsst');
        this.forDoctor = this.queueForm.get('forDoctor');
        this.doctorRequested = this.queueForm.get('doctorRequested');


        this.errors = {};
        
        this.isServeNow.valueChanges.subscribe(
            newValue => {
                if (newValue) {
                    this.schedule.setValue("");
                    this.timeSlot.setValue("");
                } else {
                    this.schedule.setValue(new Date());
                    this.timeSlot.setValue(new Date());
                }
            }
        );

        this.forDoctor.valueChanges.subscribe(
            newValue => {
                if(!newValue){
                    this.doctorRequested.setValue(0);
                }
            })

    }


    private save() {
        if (this.validateForm()) {
            this.view.dismiss({
                lastName: this.param.data.lastname,
                firstName: this.param.data.firstname,
                middleName: this.param.data.middlename,
                patientId : this.param.data.id,
                isServeNow: this.isServeNow.value,
                schedule: this.schedule.value,
                timeSlot: this.timeSlot.value,
                doneWith: 0,
                queuedFor: (this.forAsst.value ? 2 : 0) + (this.forDoctor.value ? 1 : 0),
                doctorRequested: this.forDoctor.value ? this.doctorRequested.value : '0'
            })
        }
    }

    private validateForm() {
        if(this.forAsst.value || this.forDoctor.value){
            this.errors.for = null;
        }else{
            this.errors.for = "Please select either one to serve the patient.";
        }

        return !Boolean(this.errors.for);
    }

    public getMinDate(): any {
        return Utilities.getMinDate();
    }

}