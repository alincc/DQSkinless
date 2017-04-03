import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewController } from 'ionic-angular';

import { LOVS } from '../../../constants/constants';

@Component({
    selector: 'schedule-modal',
    templateUrl: 'schedule-modal.html'
})
export class ScheduleModal {

    @Input() schedule: any;

    public scheduleForm: FormGroup;
    public days: any;

    private day: AbstractControl;
    private from: AbstractControl;
    private to: AbstractControl;

    private errors: any;

    constructor(
        private formBuilder: FormBuilder,
        private viewController: ViewController) {
        this.getDefaults();
    }

    public ngOnInit() {
        this.createForm();
    }

    private getDefaults() {

        this.errors = {
            day: '',
            from: '',
            to: ''
        };

        this.days = LOVS.DAYS;
    }

    private createForm() {
        this.scheduleForm = this.formBuilder.group({
            day: ['', [Validators.required]],
            from: ['', [Validators.required]],
            to: ['', [Validators.required]]
        });

        this.day = this.scheduleForm.get('day');
        this.from = this.scheduleForm.get('from');
        this.to = this.scheduleForm.get('to');

        this.day.valueChanges.subscribe(newValue => {
            if (this.day.hasError('required')) {
                this.errors.day = 'Day is required'
            } else {
                this.errors.day = '';
            }
        });

        this.from.valueChanges.subscribe(newValue => {
            if (this.from.hasError('required')) {
                this.errors.from = 'From is required'
            } else {
                this.errors.from = '';
            }
        });

        this.to.valueChanges.subscribe(newValue => {
            if (this.to.hasError('required')) {
                this.errors.to = 'To is required'
            } else {
                this.errors.to = '';
            }
        });
    }

    private validateForm() {
    }

    public cancel() {
        this.viewController.dismiss().catch(() => { });
    }

    public returnSchedule() {
        this.validateForm();
        if (this.scheduleForm.valid) {

            this.viewController.dismiss(this.scheduleForm.value).catch(() => { });
        }
    }
}