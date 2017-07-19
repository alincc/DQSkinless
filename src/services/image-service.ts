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
};

export const BASE64_PREFIX = "data:image/jpeg;base64,";

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
				this.getFromCache(image.imageId).then(response => {
					resolve(response);
				}, err => {
					console.log(err);
					// reject(err);
					if(err.code === GET_FROM_CACHE_ERROR.FILE_NOT_FOUND
						|| err.code === GET_FROM_CACHE_ERROR.DIRECTORY_NOT_FOUND){
						this.getFromCloud(image).subscribe(response => {
							if(response.status){
								this.saveToCache([response.result],[image.imageId], image.contentType).then(_response => {
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
				// this.getFromCloud(image).subscribe(response => {
				// 	console.log(response);
				// 	if(response.status){
				// 		resolve('data:image/jpeg;base64,'+response.result);
				// 	}
				// })
				resolve("data:image/jpeg;base64,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");
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


	getImageIDsOnFolder(bucket, folder){
		return this.http.post(CONFIG.API.getImageIdsFromFolder, {
			bucketName: bucket,
			folderName: folder
		});
	}



}