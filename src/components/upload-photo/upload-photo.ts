import { Component, Output, EventEmitter } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';

@Component({
	selector: 'upload-photo',
	templateUrl: 'upload-photo.html'
})
export class UploadPhoto {

	@Output() onSubmit = new EventEmitter();

	private image: any;
	private isLoading: boolean;
	constructor(private nav: NavController,
		private params: NavParams,
		private camera: Camera) { }

	public openCamera(){
		this.isLoading = true;
		this.camera.getPicture({cameraDirection: this.camera.Direction.FRONT,
			destinationType:this.camera.DestinationType.DATA_URL,
			correctOrientation:true
		}).then((imageData) => {
		 this.image = imageData;
		 this.isLoading = false;
		}, (err) => {
		 this.isLoading = false;
		});
	}

	public openAlbum() {
		this.camera.getPicture({
			sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
			destinationType:this.camera.DestinationType.DATA_URL,
			correctOrientation:true
		}).then((imageData) => {
		 this.image = imageData;
		 this.isLoading = false;
		}, (err) => {
		 this.isLoading = false;
		});
	}

	public skip(){
		this.onSubmit.emit('Skip');
	}

	public submit(){
		this.onSubmit.emit('todo photo in base 64');
	}

}

