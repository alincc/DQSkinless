import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'add-queue-form-modal',
	templateUrl: 'add-queue-form-modal.html'
})
export class AddQueueFormModal{
    private queueForm: FormGroup;
    private lastName: AbstractControl;
    private firstName: AbstractControl;
    private middleName: AbstractControl;
    private errors: any;

    constructor(private formBuilder: FormBuilder,
    	private view: ViewController){
    	this.initFormGroup();
    }

    private initFormGroup(){
    	this.queueForm = this.formBuilder.group({
    		lastName: ["", Validators.required],
            firstName: ["", Validators.required],
            middleName: ""
        });

    	this.lastName = this.queueForm.get('lastName');
        this.firstName = this.queueForm.get('firstName');
        this.middleName = this.queueForm.get('middleName');

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

    }


    private save(){
    	if(this.validateForm()){
	    	this.view.dismiss({
	    		lastName: this.lastName.value,
	    		firstName: this.firstName.value,
	    		middleName: this.middleName.value
	    	})
    	}
    }

    private validateForm(){
    	return !Boolean(this.errors.lastName || this.errors.firstName);
    }

}