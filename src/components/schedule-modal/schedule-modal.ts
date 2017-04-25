import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewController } from 'ionic-angular';

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
    public header: any;

    private day: AbstractControl;
    private from: AbstractControl;
    private to: AbstractControl;
    private errors: any;

    constructor(
        private datePipe: DatePipe,
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
                this.errors.day = 'Day of Week is required'
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

    public save() {
        this.markFormAsDirty();
        this.validateForm();
        const newSchedule = {
            dayOfWeek: this.scheduleForm.get('day').value,
            startTime: this.formatTime(this.scheduleForm.get('from').value),
            endTime: this.formatTime(this.scheduleForm.get('to').value)
        }

        if (this.scheduleForm.valid) {
            this.viewController.dismiss(newSchedule).catch(() => { });
        }
    }

    private markFormAsDirty() {
        Object.keys(this.scheduleForm.controls).forEach(key => {
            this.scheduleForm.get(key).markAsDirty();
        });
    }

    private validateForm() {
        if (this.day.hasError('required')) {
            this.errors.day = 'Day of Week is required';
        } else {
            this.errors.day = '';
        }

        if (this.from.hasError('required')) {
            this.errors.from = 'From is required';
        } else {
            this.errors.from = '';
        }

        if (this.to.hasError('required')) {
            this.errors.to = 'To is required';
        } else {
            this.errors.to = '';
        }

        if (!this.from.hasError('required') && !this.to.hasError('required')) {
            if (this.from.value === this.to.value) {
                this.errors.to = 'From and To cannot be equal';
                this.from.setErrors({ error: true });
                this.to.setErrors({ error: true });
            } else {
                this.errors.to = '';
                this.from.setErrors(null);
                this.to.setErrors(null);
            }
        }
    }

    private formatTime(time) {
        return this.datePipe.transform(new Date('1970/01/01 ' + time), 'hh:mm a');
    }
}
