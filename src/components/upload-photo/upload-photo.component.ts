import { Component, Output, EventEmitter } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { Images, Storage } from '../../services/services';
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
		private camera: Camera,
		private images: Images,
		private storage: Storage,
		private alert: AlertController) { 
	}

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
		this.onSubmit.emit();
	}

	public getImageName(){
		return this.storage.account.userId + "_profile_pic.jpg";
	}

	public submit(){
		this.images.saveImage(this.getImageName(), this.image, { replace : true}).then(
            resolve => {
				this.onSubmit.emit(resolve);
            }, err => {
                this.alert.create("Something Went wrong application throws: " + err).present();
            })

	}

}

