import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'condition-modal',
  templateUrl: 'condition-modal.html'
})
export class ConditionModal implements OnInit{

  private conditionForm: FormGroup;

  private errors: any;

  private description: AbstractControl;
  private diagnosed: AbstractControl;

  constructor(
    private formBuilder: FormBuilder,
    private view: ViewController
  ) {
    
  }

  public ngOnInit(){
    
    this.createForm();
    this.errors = {};
  }

  private createForm(){
    this.conditionForm = this.formBuilder.group({
      description: ['', Validators.required],
      diagnosed: ['', Validators.required]
    });

    this.description = this.conditionForm.get('description');
    this.description.valueChanges.subscribe(newValue => {
      this.errors.description = this.description.hasError('required') ? 'Description is required' : '';
    });

    this.diagnosed = this.conditionForm.get('diagnosed');
    this.diagnosed.valueChanges.subscribe(newValue => {
      this.errors.diagnosed = this.diagnosed.hasError('required') ? 'Diagnosis date is required' : '';
    });
  }

  private save() {
		this.markFormAsDirty();
		this.validateForm();
		if (this.conditionForm.valid) {
			this.view.dismiss({
				description: this.description.value,
        diagnosed: this.diagnosed.value
			});
		}
	}

  private markFormAsDirty() {
		Object.keys(this.conditionForm.controls).forEach(key => {
			this.conditionForm.get(key).markAsDirty();
		});
	}

  private validateForm() {
		this.errors.description = this.description.hasError('required') ? 'Description is required' : '';
    this.errors.diagnosed = this.diagnosed.hasError('required') ? 'Diagnosis date is required' : '';
	}

}
