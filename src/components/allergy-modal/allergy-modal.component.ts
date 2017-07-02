import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'allergy-modal',
  templateUrl: 'allergy-modal.html'
})
export class AllergyModal implements OnInit{

  private allergyForm: FormGroup;

  private errors: any;

  private description: AbstractControl;

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
    this.allergyForm = this.formBuilder.group({
      description: ['', Validators.required]
    });

    this.description = this.allergyForm.get('description');

    this.description.valueChanges.subscribe(newValue => {
      this.errors.description = this.description.hasError('required') ? 'Description is required' : '';
    });
  }

  private save() {
		this.markFormAsDirty();
		this.validateForm();
		if (this.allergyForm.valid) {
			this.view.dismiss({
				description: this.description.value,
			});
		}
	}

  private markFormAsDirty() {
		Object.keys(this.allergyForm.controls).forEach(key => {
			this.allergyForm.get(key).markAsDirty();
		});
	}

  private validateForm() {
		this.errors.description = this.description.hasError('required') ? 'Description is required' : '';
	}

}
