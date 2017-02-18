import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
	selector: "more-menu-popover",
	template: `<ion-list>
      <ion-list-header>Header</ion-list-header>
      <button ion-item (click)="view()"><ion-icon name="folder-open" color="accent"></ion-icon>View</button>
      <button ion-item (click)="remove()"><ion-icon name="eye-off" color="accent"></ion-icon>No-Show</button>
    </ion-list>`
})
export class MoreMenuPopover{
	constructor(public viewCtrl: ViewController) {}

	public view(){
		this.viewCtrl.dismiss('V');
	}
	public remove(){
		this.viewCtrl.dismiss('R');
	}
}