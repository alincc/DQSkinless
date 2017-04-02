import { Component } from '@angular/core';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { NavParams, ViewController } from 'ionic-angular';
import { LOVS } from '../../constants/constants';

@Component({
	selector: 'contact-modal',
	templateUrl: 'contact-modal.html'
})
export class ContactModal{

	private contactForm : FormGroup;
	private header: string;
	private returnItem: any;
	private contactTypeList : any[] = LOVS.CONTACT_TYPE;
	private errors: any;
	constructor(private params: NavParams,
		private formBuilder: FormBuilder,
		private view: ViewController){
		this.header = params.data.header;
		this.returnItem = {};
		this.errors = {};
		this.contactForm = formBuilder.group({
			contactType: ['', Validators.required],
			contactDetail: ['', Validators.required, Validators.pattern('[0-9]*')]
		})
	}

	private save(){
		this.view.dismiss();
	}
}