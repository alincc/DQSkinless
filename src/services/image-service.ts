import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import { Storage } from './storage';

const IMG_PATH = "diagram";


@Injectable()
export class Images {

	constructor(private file: File,
		private storage: Storage) {
	}

	// save image locally and if connected to net sync to cloud
	public saveImage(filename, content, contentType?): Promise<any> {

		return new Promise((resolve, reject) => {
			// fetching path
			console.log("Starting to get Path.");
			let DataBlob = this.b64toBlob(content, contentType);
			let DataPath = this.getTargetSD();

			let ImgPath = DataPath + IMG_PATH;
			this.checkAndCreateDirectory(DataPath, () => {

				console.log("Path target is : " + ImgPath,
					"Resolving Path");
				this.file.resolveDirectoryUrl(ImgPath).then((dir) => {

					console.log("Access to the directory granted succesfully");
					this.file.writeFile(ImgPath, filename, DataBlob, {}).then(file => {
						console.log("File created succesfully.", file);
						resolve(file);
					}, err => {
						console.log("File create was unsuccesfull", err);
						reject(err);
					})

				}, err => {
					console.log('Unable to save file in path ' + ImgPath);
					reject(err);
				});
			})
		});
	}

	//check if directory is present;
	private checkDirectory(DataPath: string, callback: any, errorHandler?: any) {
		console.log("Check if dir exist:", DataPath);
		this.file.checkDir(DataPath, IMG_PATH).then(resolve => {
			console.log("directory exist");
			callback(resolve);
		}, reject => {
			errorHandler(reject);
		})
	}
	//check if directory is present if not create new;
	private checkAndCreateDirectory(DataPath: string, callback: any) {
		this.checkDirectory(DataPath, resolve => {
			callback(resolve);
		}, err => {
			console.log("creating directory");
			this.file.createDir(DataPath, IMG_PATH, true).then(resolve => {
				console.log("created dir: ", resolve);
				callback(resolve);
			}, err => {
				throw err;
			});
		})
	}

	public setTargetSD(target) {
		this.storage.config = this.storage.config.imgPath = target;
	}

	private getTargetSD(): string {
		return this.storage.config && this.storage.config.imgPath ? this.file.externalCacheDirectory : this.file.cacheDirectory;
	}

	// sync image to cloud
	private getFromCloud() {
		//TODO: waitiing for api
		return null;
	}


	//get base64 Image that auto sync from cloud when missing
	public getImage(fileName): Promise<string> {
		console.log("fetching ", fileName)
		return new Promise((resolve, reject) => {
			let dataPath = this.getTargetSD();
			let imgPath = dataPath + IMG_PATH;
			this.checkDirectory(dataPath, response => {
				this.file.resolveDirectoryUrl(imgPath).then((dir) => {
					this.file.readAsDataURL(imgPath, fileName).then(file => {
						resolve(file);
					})
				}, err => {
					console.log("Access to the directory is not granted");
					resolve(this.getFromCloud());
				});
			}, err => {
				console.log("Directory not found, maybe not created due to no existing img")
				resolve(this.getFromCloud());
			})
			return null;
		});

	}


	private b64toBlob(b64Data, contentType?, sliceSize?) {
		contentType = contentType || '';
		sliceSize = sliceSize || 512;

		var byteCharacters = atob(b64Data);
		var byteArrays = [];

		for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			var slice = byteCharacters.slice(offset, offset + sliceSize);

			var byteNumbers = new Array(slice.length);
			for (var i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}

			var byteArray = new Uint8Array(byteNumbers);

			byteArrays.push(byteArray);
		}

		var blob = new Blob(byteArrays, { type: contentType });
		return blob;
	}



}