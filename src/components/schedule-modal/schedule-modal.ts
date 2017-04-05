import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavParams, ViewController } from 'ionic-angular';

import { LOVS } from '../../constants/constants';

@Component({
    selector: 'schedule-modal',
    templateUrl: 'schedule-modal.html',
    providers: [DatePipe]
})
export class ScheduleModal {

    @Input() schedule: any;

    public scheduleForm: FormGroup;
    public days: any;
    public mode: any;

    private errors: any;

    constructor(
        private datePipe: DatePipe,
        private formBuilder: FormBuilder,
        private params: NavParams,
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

        this.mode = this.params.data.mode;
    }

    private createForm() {
        this.scheduleForm = this.formBuilder.group({
            day: ['', [Validators.required]],
            from: ['', [Validators.required]],
            to: ['', [Validators.required]]
        });

        const day = this.scheduleForm.get('day');
        const from = this.scheduleForm.get('from');
        const to = this.scheduleForm.get('to');

        day.valueChanges.subscribe(newValue => {
            if (day.hasError('required')) {
                this.errors.day = 'Day is required'
            } else {
                this.errors.day = '';
            }
        });

        from.valueChanges.subscribe(newValue => {
            if (from.hasError('required')) {
                this.errors.from = 'From is required'
            } else {
                this.errors.from = '';
            }
        });

        to.valueChanges.subscribe(newValue => {
            if (to.hasError('required')) {
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

    public save() {
        this.validateForm();

        const newSchedule = {
            day: this.scheduleForm.get('day').value,
            from: this.formatTime(this.scheduleForm.get('from').value),
            to: this.formatTime(this.scheduleForm.get('to').value)
        }

        if (this.scheduleForm.valid) {

            this.viewController.dismiss(newSchedule).catch(() => { });
        }
    }

    private formatTime(time) {
        return this.datePipe.transform(new Date('1970/01/01 ' + time), 'hh:mm a');
    }
}