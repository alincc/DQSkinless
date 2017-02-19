import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
	selector: "more-menu-popover",
	template: `<ion-list>
      <ion-list-header>More...</ion-list-header>
      <button ion-item (click)="return()"><ion-icon name="return-left" color="accent"></ion-icon>Queue Again</button>
      <button ion-item (click)="remove()"><ion-icon name="eye-off" color="accent"></ion-icon>No-Show</button>
    </ion-list>`
})
export class MoreMenuPopover{
	constructor(public viewCtrl: ViewController) {}

	public return(){
		this.viewCtrl.dismiss(0);
	}
	public remove(){
		this.viewCtrl.dismiss(1);
	}
}