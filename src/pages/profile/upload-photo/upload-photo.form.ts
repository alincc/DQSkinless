import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera, ImagePicker } from 'ionic-native';

@Component({
	selector: 'upload-photo-form',
	templateUrl: 'upload-photo.html'
})
export class UploadPhotoForm{
	public image:any;
	constructor(private nav:NavController){}

	public openCamera(){
		Camera.getPicture({cameraDirection:1,destinationType:2, correctOrientation:true,encodingType: 0}).then((imageData) => {
		 // imageData is either a base64 encoded string or a file URI
		 // If it's base64:
		 this.image = 'data:image/jpeg;base64,' + imageData;
		}, (err) => {
		 // Handle error
		});
	}

	public openAlbum(){
		ImagePicker.getPictures({maximumImagesCount: 1}).then((results) => {
		  console.log(results);
		  for (var i = 0; i < results.length; i++) {
		      console.log('Image URI: ' + results[i]);
		      this.image.imageData(results[i]);
		  }
		}, (err) => { });

	}

}

