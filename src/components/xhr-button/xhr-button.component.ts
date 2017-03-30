import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'xhr-button',
	template: `<button ion-button [round]="round" [large]="large" [disabled]="disabled" [color]="color" [type]="type"
		[full]="full"
		[block]="block"
		(click)="submit($event)">
			<ng-content></ng-content>
		</button>`
})
export class XHRButton{

	//attrb directive
	@Input()
	private round: boolean;
	@Input()
	private large: boolean;
	@Input()
	private color: string;
	@Input()
	private disabled: boolean;
	@Input()
	private full: boolean;
	@Input()
	private block: boolean;
	@Input()
	private type: string;

	//emitters
	@Output()
	private xhrClick : EventEmitter<any> = new EventEmitter<any>();

	//subscribers
	@Input()
	private set subscribeTo(event){
		event.subscribe( response => {
			this.submit(response);
		})
	}
	//loading container
	private loading: any; 
	//event
	private event: any;

	constructor(private loadingCtrl: LoadingController){}
	
	public submit(event){
		this.showLoading();
		this.event = event;
		this.xhrClick.emit(this);
	}

	public showLoading(){
		this.loading = this.loadingCtrl.create({
			spinner: 'crescent',
			cssClass: 'xhr-loading'
		});
		this.loading.present();
	}


	public dismissLoading(){
		if(this.loading){
			this.loading.dismiss();
		}
	}


}