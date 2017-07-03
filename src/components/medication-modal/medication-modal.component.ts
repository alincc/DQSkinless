import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'medication-modal',
  templateUrl: 'medication-modal.html'
})
export class MedicationModal implements OnInit{

  private medicationForm: FormGroup;

  private errors: any;

  private description: AbstractControl;
  private startDate: AbstractControl;

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
    this.medicationForm = this.formBuilder.group({
      description: ['', Validators.required],
      startDate: ['', Validators.required]
    });

    this.description = this.medicationForm.get('description');
    this.description.valueChanges.subscribe(newValue => {
      this.errors.description = this.description.hasError('required') ? 'Description is required' : '';
    });

    this.startDate = this.medicationForm.get('startDate');
    this.startDate.valueChanges.subscribe(newValue => {
      this.errors.startDate = this.startDate.hasError('required') ? 'Start date is required' : '';
    });
  }

  private save() {
		this.markFormAsDirty();
		this.validateForm();
		if (this.medicationForm.valid) {
			this.view.dismiss({
				description: this.description.value,
        startDate: this.startDate.value
			});
		}
	}

  private markFormAsDirty() {
		Object.keys(this.medicationForm.controls).forEach(key => {
			this.medicationForm.get(key).markAsDirty();
		});
	}

  private validateForm() {
		this.errors.description = this.description.hasError('required') ? 'Description is required' : '';
    this.errors.startDate = this.startDate.hasError('required') ? 'Start date is required' : '';
	}

}
