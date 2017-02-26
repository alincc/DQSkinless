import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { DrawingPad } from '../../components/drawing-pad/drawing-pad';
/*
  Generated class for the ConsultationForm page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-consultation-form',
  templateUrl: 'consultation-form.html'
})
export class ConsultationFormPage {
  private images : any[] =  [];
  constructor(public navCtrl: NavController, public navParams: NavParams
  	, private modal: ModalController) {}

  addAttachment(){
  	let modal = this.modal.create(DrawingPad, {diagram: 'MF'});
  	modal.onDidDismiss(data => {
  		this.images.push(data);
  	})
  	modal.present();
  }
}
