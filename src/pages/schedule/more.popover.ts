import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
	selector: "more-menu-popover",
	template: `<ion-list>
      <ion-list-header>More...</ion-list-header>
      <button ion-item (click)="return()" [disabled]="params.data.disableButtons"><ion-icon name="return-left" color="accent"></ion-icon>Queue Again</button>
      <button ion-item (click)="remove()" [disabled]="params.data.disableButtons"><ion-icon name="eye-off" color="accent"></ion-icon>No-Show</button>
      <button ion-item (click)="reorder()"><ion-icon name="shuffle" color="accent"></ion-icon>Re-Order</button>
    </ion-list>`
})
export class MoreMenuPopover{
	constructor(public viewCtrl: ViewController,
		private params: NavParams) {
		console.log(params)
	}

	public return(){
		this.viewCtrl.dismiss(0);
	}
	public remove(){
		this.viewCtrl.dismiss(1);
	}
	public reorder(){
		this.viewCtrl.dismiss(2);
	}
}