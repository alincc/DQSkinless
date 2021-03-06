import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { DrawingPad } from '../../components/drawing-pad/drawing-pad.component';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import { Camera } from '@ionic-native/camera';
// import { ImagePicker } from '@ionic-native/';
import { DIAGRAM } from '../../constants/constants';

const buttonLabels = ['Camera', 'Album', 'Diagram'];

@Component({
  selector: 'page-consultation-form',
  templateUrl: 'consultation-form.html'
})
export class ConsultationFormPage {
  private images: any[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private modal: ModalController,
    private camera: Camera,
    private actionSheet: ActionSheet,
    private nav: NavController,) { }

  addAttachment() {
    this.actionSheet.show({
      title: 'Add Attachment',
      buttonLabels: buttonLabels,
      addCancelButtonWithLabel: "Cancel",
      destructiveButtonLast: false
    }).then((idx: number) => {
      switch (idx) {
        case 1:
          this.camera.getPicture({ cameraDirection: 1, destinationType: 2, correctOrientation: true, encodingType: 0 }).then((imageData) => {
            if (imageData) {
              this.images.push('data:image/jpeg;base64,' + imageData);
            }
          }, (err) => {
            // Handle error
          });
          break;
        case 2:
          // ImagePicker.getPictures({ maximumImagesCount: 1 }).then((results) => {
          //   console.log(results);
          //   for (var i = 0; i < results.length; i++) {
          //     this.images.push(results[i]);
          //   }
          // }, (err) => { });
          break;
        case 3:
          this.actionSheet.show({
            title: 'Add Attachment',
            buttonLabels: DIAGRAM.label,
            addCancelButtonWithLabel: "Cancel",
            destructiveButtonLast: false
          }).then((idx: number) => {
            if (idx > 0) {
              let modal = this.modal.create(DrawingPad, { diagram: --idx });
              modal.onDidDismiss(data => {
                if (data) {
                  this.images.push(data);
                }
              })
              modal.present();
            }
          })
      }
    });
  }
}
