import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { DrawingPad } from '../../components/drawing-pad/drawing-pad';
import { ActionSheet, Camera, ImagePicker } from 'ionic-native';
import { DIAGRAM } from '../../constants/constants';
/*
  Generated class for the ConsultationForm page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
  */
  const buttonLabels = ['Camera', 'Album', 'Diagram'];
  @Component({
    selector: 'page-consultation-form',
    templateUrl: 'consultation-form.html'
  })
  export class ConsultationFormPage {
    private images : any[] =  [];
    constructor(public navCtrl: NavController, public navParams: NavParams,
      private modal: ModalController) {}

    addAttachment(){
      ActionSheet.show({
        title: 'Add Attachment',
        buttonLabels: buttonLabels,
        addCancelButtonWithLabel: "Cancel"
      }).then((idx:number)=>{
        switch(idx){
          case 1: 
          Camera.getPicture({cameraDirection:1,destinationType:2, correctOrientation:true,encodingType: 0}).then((imageData) => {
            if(imageData){
              this.images.push('data:image/jpeg;base64,' + imageData);
            } 
          }, (err) => {
            // Handle error
          });
          break;
          case 2:
          ImagePicker.getPictures({ maximumImagesCount: 1 }).then((results) => {
            console.log(results);
            for (var i = 0; i < results.length; i++) {
              this.images.push(results[i]);
            }
          }, (err) => { });
          break;
          case 3:
          ActionSheet.show({
            title: 'Add Attachment',
            buttonLabels: DIAGRAM.label,
            addCancelButtonWithLabel: "Cancel"
          }).then((idx:number)=>{
            if(idx > 0){
              let modal = this.modal.create(DrawingPad, {diagram: --idx});
              modal.onDidDismiss(data => {
                if(data){
                  this.images.push(data);
                }
              })
              modal.present();
            }
          })
        }
      })



      // let modal = this.modal.create(DrawingPad, {diagram: 'MF'});
      // modal.onDidDismiss(data => {
        //    if(data){
          //  		this.images.push(data);
          //    }
          // })
          // modal.present();
        }
      }
