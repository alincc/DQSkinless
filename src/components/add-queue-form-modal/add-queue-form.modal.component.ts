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
    private lastName: AbstractControl;
    private firstName: AbstractControl;
    private middleName: AbstractControl;
    private isServeNow: AbstractControl;
    private schedule: AbstractControl;
    private timeSlot: AbstractControl;
    private errors: any;

    constructor(private formBuilder: FormBuilder,
        private view: ViewController,
        private param: NavParams) {
        this.initFormGroup(param.data);
    }

    private initFormGroup(data?) {
        this.queueForm = this.formBuilder.group({
            lastName: [data.lastName || "", Validators.required],
            firstName: [data.firstName || "", Validators.required],
            middleName: data.middleName || "",
            isServeNow: [data.type ? (data.type === QUEUE.TYPE.WALKIN ? true : false) : true],
            schedule: [data.schedule || new Date()],
            timeSlot: [data.timeSlot || new Date()]
        });

        this.lastName = this.queueForm.get('lastName');
        this.firstName = this.queueForm.get('firstName');
        this.middleName = this.queueForm.get('middleName');
        this.isServeNow = this.queueForm.get('isServeNow');
        this.schedule = this.queueForm.get('schedule');
        this.timeSlot = this.queueForm.get('timeSlot');

        this.errors = {};
        this.lastName.valueChanges.subscribe(
            newValue => {
                if (this.lastName.hasError('required')) {
                    this.errors.lastName = 'Last Name is required';
                } else {
                    this.errors.lastName = '';
                }
            }
        );

        this.firstName.valueChanges.subscribe(
            newValue => {
                if (this.firstName.hasError('required')) {
                    this.errors.firstName = 'First Name is required';
                } else {
                    this.errors.firstName = '';
                }
            }
        );

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

    }


    private save() {
        if (this.validateForm()) {
            this.view.dismiss({
                lastName: this.lastName.value,
                firstName: this.firstName.value,
                middleName: this.middleName.value,
                isServeNow: this.isServeNow.value,
                schedule: this.schedule.value,
                timeSlot: this.timeSlot.value
            })
        }
    }

    private validateForm() {
        if (this.lastName.hasError('required')) {
            this.errors.lastName = 'Last Name is required';
        }
        if (this.firstName.hasError('required')) {
            this.errors.firstName = 'First Name is required';
        }
        return !Boolean(this.errors.lastName || this.errors.firstName);
    }

    public getMinDate(): any {
        return Utilities.getMinDate();
    }

}