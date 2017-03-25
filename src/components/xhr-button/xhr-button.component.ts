import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'xhr-button',
	template: `<button ion-button [round]="round" [large]="large" [color]="color" (click)="submit()"> <ng-content></ng-content> </button>`
})
export class XHRButton{

	private _eventSubscription: any;
	@Input() 
	private submitSubscriber(eventEmitter){
		if(eventEmitter){
			if(this._eventSubscription){
				this._eventSubscription.unsubscribe();
			}
			this._eventSubscription = eventEmitter.subscribe(()=>{
				this.submit();
			})
		}
	}
	@Input()
	private observableFn: any;
	@Input()
	private parameter: any;
	@Input()
	private round: boolean;
	@Input()
	private large: boolean;
	@Input()
	private color: string;

	@Output()
	private onSuccess: EventEmitter<any> = new EventEmitter();
	@Output()
	private onError: EventEmitter<any> = new EventEmitter();
	@Output()
	private onComplete: EventEmitter<any> = new EventEmitter();

	constructor(private loading: LoadingController){}



	private submit(){
		let loading = this.loading.create({
			spinner: 'crescent',
			cssClass: 'xhr-loading'
		});
		loading.present();
		if(Observable){
			this.observableFn(this.parameter).subscribe(
				response => {this.onSuccess.emit(response)},
				err => {
					this.onError.emit(err)
					loading.dismiss();
				},
				() => {
					this.onComplete.emit()
					loading.dismiss();
				}
			);
		}
	}


}