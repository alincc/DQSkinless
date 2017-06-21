import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import { Storage } from './storage';
import { HttpService } from './http-service';
import { CONFIG } from '../config/config';
import { Platform } from 'ionic-angular';

const IMG_PATH = "medappws";
const IMG_ACTION = {
	UPLOAD : "upload",
	DOWNLOAD : "download"
}

const GET_FROM_CACHE_ERROR = {
	DIRECTORY_NOT_FOUND : 0,
	NO_ACCESS : 1,
	FILE_NOT_FOUND : 2
}
export const IMG_BUCKET = {
	USER:"medappws-profile",
	PATIENT: "medappws-attachment"
}

interface image {
	bucketName : string,
	folderName : string,
	ownerId : string,
	imageId? : string,
	content? : string[],
	contentType? : string,
	cacheId? : string[]
}

@Injectable()
export class Images {

	constructor(private file: File,
		private storage: Storage,
		private http : HttpService,
		private platform : Platform) {
	}

	// save image locally and if connected to net sync to cloud
	public saveImage(image : image): Promise<any> {

		return new Promise((resolve, reject) => {
			//saving to cloud
			this.saveToCloud(image).subscribe(response => {
				console.log(response);
				if(this.platform.is("cordova")){
					//saving to cache
					if(response.status && response.result){
						this.saveToCache(image.content, image.cacheId,image.contentType).then(_response => {
							resolve(_response);
						});	
					}
				}else{
					resolve(response);
				}
			}, err => {
				console.log(err);
				reject(err);
			});
			
		});
	}

	private saveToCache(image : string[], imageId : string[], contentType: string){
		console.log("Starting to get Path.");
		let DataPath = this.getTargetSD();

		let ImgPath = DataPath + IMG_PATH;
		return new Promise((resolve, reject) => {
			this.checkAndCreateDirectory(DataPath, () => {
				console.log("Path target is : " + ImgPath,
					"Resolving Path");
				this.file.resolveDirectoryUrl(ImgPath).then((dir) => {
					let overallSuccess : boolean = true;
					let overallFiles : any[] = [];
					let overallErrors : any[] = [];
					console.log("Access to the directory granted succesfully");
					image.forEach((content, idx) => {
						let DataBlob = this.b64toBlob(content, contentType);
						this.file.writeFile(ImgPath, imageId[idx] + ".jpg", DataBlob, {replace: true}).then(file => {
							console.log("File created succesfully.", file);
							// resolve(file);
							overallFiles.push(file);
						}, err => {
							console.log("File create was unsuccesfull", err);
							// reject(err);
							overallErrors.push(err);
							overallSuccess = false;
						})
					});
					if(overallSuccess){
						resolve(overallFiles);
					}else{
						reject(overallErrors);
					}

				}, err => {
					console.log('Unable to save file in path ' + ImgPath);
					reject(err);
				});
			});
		})
		
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
	private getFromCloud(image : image) {
		//TODO: waitiing for api
		return this.http.post(CONFIG.API.imageBucket,  Object.assign({},image,{action:IMG_ACTION.DOWNLOAD}));
	}

	private saveToCloud(image: image){
		return this.http.post(CONFIG.API.imageBucket,  Object.assign({},image,{action:IMG_ACTION.UPLOAD}));
	}


	//get base64 Image that auto sync from cloud when missing
	public getImage(image: image): Promise<string> {
		return new Promise((resolve, reject) => {
			if(this.platform.is('cordova')){
				this.getFromCache(image.cacheId[0]).then(response => {
					resolve(response);
				}, err => {
					console.log(err);
					// reject(err);
					if(err.code === GET_FROM_CACHE_ERROR.FILE_NOT_FOUND
						|| err.code === GET_FROM_CACHE_ERROR.DIRECTORY_NOT_FOUND){
						this.getFromCloud(image).subscribe(response => {
							if(response.status){
								this.saveToCache([response.result],image.cacheId, image.contentType).then(_response => {
									resolve('data:image/jpeg;base64,'+response.result);
								}, err => {
									reject(err)
								})
							}else{
								reject(response.errorDescription);
							}
						}, _err => {
							console.log(_err)
							reject(err);
						})
					}else{
						reject(err);
					}
				})
			}else{
				this.getFromCloud(image).subscribe(response => {
					console.log(response);
					if(response.status){
						resolve('data:image/jpeg;base64,'+response.result);
					}
				})
			}
		})	
	}

	private getFromCache(fileName){
		console.log("fetching ", fileName)
		return new Promise((resolve, reject) => {
				let dataPath = this.getTargetSD();
				let imgPath = dataPath + IMG_PATH;
				this.checkDirectory(dataPath, response => {
					this.file.resolveDirectoryUrl(imgPath).then((dir) => {
						this.file.readAsDataURL(imgPath, fileName + ".jpg").then(file => {
							resolve(file);
						}, err => {
							reject({
								error : "File does not exist",
								code : GET_FROM_CACHE_ERROR.FILE_NOT_FOUND
							});
						})
					}, err => {
						console.log("Access to the directory is not granted");
						reject({
							error : "Access to the directory is not granted",
							code : GET_FROM_CACHE_ERROR.NO_ACCESS
						});
					});
				}, err => {
					console.log("Directory not found, maybe not created due to no existing img")
					reject({
						error : "Directory not found, maybe not created due to no existing img",
						code : GET_FROM_CACHE_ERROR.DIRECTORY_NOT_FOUND
					});
				})
			
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