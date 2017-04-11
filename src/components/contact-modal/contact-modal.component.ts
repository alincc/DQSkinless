import { Component } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavParams, ViewController } from 'ionic-angular';
import { LOVS } from '../../constants/constants';

@Component({
	selector: 'contact-modal',
	templateUrl: 'contact-modal.html'
})
export class ContactModal {

	private contactForm: FormGroup;
	private header: string;
	private returnItem: any;
	public contactTypeList: any[] = LOVS.CONTACT_TYPE;
	private errors: any;

	private contactType: AbstractControl;
	private contactDetail: AbstractControl;
	constructor(private params: NavParams,
		private formBuilder: FormBuilder,
		private view: ViewController) {
		this.header = params.data.header;
		this.returnItem = {};
		this.errors = {};
		this.contactForm = formBuilder.group({
			contactType: ['', Validators.required],
			contactDetail: ['', [Validators.required, Validators.pattern('[0-9]*')]]
		});

		this.contactType = this.contactForm.get('contactType')
		this.contactType.valueChanges.subscribe(newValue => {
			if (this.contactType.hasError('required')) {
				this.errors.contactType = 'Contact Type is required';
			} else {
				this.errors.contactType = '';
			}
		});
		this.contactDetail = this.contactForm.get('contactDetail');
		this.contactDetail.valueChanges.subscribe(newValue => {
			if (this.contactDetail.hasError('required')) {
				this.errors.contactDetail = "Contact Detail is required";
			} else if (this.contactDetail.hasError('pattern')) {
				this.errors.contactDetail = "Contact Detail should consist of numbers only";
			} else {
				this.errors.contactDetail = '';
			}
		});
	}

	public save() {
		this.markFormAsDirty();
		this.validateForm();
		if (this.contactForm.valid) {
			this.view.dismiss({
				contactType: this.contactType.value,
				contact: this.contactDetail.value
			});
		}
	}

	private markFormAsDirty() {
		Object.keys(this.contactForm.controls).forEach(key => {
			this.contactForm.get(key).markAsDirty();
		});
	}

	private validateForm() {
		if (this.contactType.hasError('required')) {
			this.errors.contactType = 'Contact Type is required';
		} else {
			this.errors.contactType = '';
		}

		if (this.contactDetail.hasError('required')) {
			this.errors.contactDetail = "Contact Detail is required";
		} else if (this.contactDetail.hasError('pattern')) {
			this.errors.contactDetail = "Contact Detail should consist of numbers only";
		} else {
			this.errors.contactDetail = '';
		}
	}
}
