import { Component, ViewChild, ChangeDetectorRef, Input, EventEmitter } from '@angular/core';
import { PopoverController, Content, ModalController, LoadingController, AlertController, Loading, NavController } from 'ionic-angular';
import { MoreMenuPopover } from './more.popover';

import { PatientProfilePage } from '../patient-profile/patient-profile.page';
import { ScheduleHistoryPage } from '../schedule-history/schedule-history.page';

import { ScheduleService } from './schedule.service';

import { RootNavController } from '../../services';
import { QUEUE } from '../../constants/constants'
import { AddQueueFormModal } from '../../components/add-queue-form-modal/add-queue-form.modal.component'
import { PatientInformationPage } from '../patient-information/patient-information.page';
import { XHRButton } from '../../components/xhr-button/xhr-button.component';
import {
	trigger,
	state,
	style,
	animate,
	transition
} from '@angular/animations';
import { Utilities } from '../../utilities/utilities';
import { Storage } from '../../services';
import { QueueStore } from '../../store';





@Component({
	selector: 'schedule-page',
	templateUrl: 'schedule.html',
	providers: [ScheduleService],
	animations: [
		trigger('queue', [
			state('*', style({ transform: 'translateX(0)' })),
			transition('void => *', [
				style({ transform: 'translateX(-100%)' }),
				animate(300)
			]),
			transition('* => void', [
				animate(300, style({ transform: 'translateX(100%)' }))
			])
		]),
		trigger('serve', [
			state('*', style({ transform: 'translateX(0)' })),
			transition('void => *', [
				style({ transform: 'translateX(-100%)' }),
				animate(300)
			]),
			transition('* => void', [
				animate(300, style({ transform: 'translateX(100%)' }))
			])
		])
	]
})
export class SchedulePage {
	public queue: any[];
	@ViewChild(Content)
	private content: Content;
	@ViewChild('ServingNow')
	private set _servingNow(dom) {
		this.servingNow = dom.nativeElement;
	}
	@ViewChild('removeBtn')
	private removeBtn: XHRButton;
	@ViewChild('queueAgainBtn')
	private queueAgainBtn: XHRButton;
	// private ws: any;
	private servingNow: any;
	private queueTopOffset: number;
	public controlCss: boolean;
	private isReOrder: boolean;
	private queueBoard: any;
	private serving: any;
	// private connection: any;
	private requestForRefresh: any;
	private clinicId: any;
	private servingState: string;
	private loading: any;
	private canQueue : boolean;
	@Input() patient: any;
	constructor(private popover: PopoverController,
		private rootNav: RootNavController,
		private detector: ChangeDetectorRef,
		private service: ScheduleService,
		private modal: ModalController,
		private loadingCtrl: LoadingController,
		private alert: AlertController,
		private storage: Storage,
		private nav: NavController,
		private store : QueueStore
		) {

		store.queueListSubject.subscribe(queueList => {
			if(queueList){
				this.queue = null;
				this.initQueue(queueList);
				this.hasForQueue();
				detector.detectChanges();
			}
		})

		this.patient = {};
	}


	private initQueue(queueList){
		let account = this.storage.account;
		let newQueueList = [];
		let currentServing = null;
		for (let queue of queueList) {
			switch (queue.status) {
				case QUEUE.STATUS.SERVING:
					if(queue.queuedBy === account.userId){
						currentServing = queue;
					}
					break;
				case QUEUE.STATUS.QUEUED:
				case QUEUE.STATUS.EN_ROUTE:
				case QUEUE.STATUS.OUT:
					let canQueue = (queue.queuedFor - queue.doneWith);
					queue.canServeNow = (canQueue === account.role || canQueue === 3) && 
						((account.role === 1 && (queue.doctorRequested === 0 || queue.doctorRequested === account.userId) ||
							account.role === 2))
						;
					newQueueList.push(queue);
					break;
			}
		}

		this.serving = currentServing;
		this.queue = newQueueList;
	}

	public ngAfterViewInit() {
		this.queueTopOffset = this.servingNow.clientHeight;
		this.content.ionScroll.subscribe(event => {
			if (event.scrollTop > this.queueTopOffset) {
				if (!this.controlCss) {
					this.controlCss = true;
					this.detector.detectChanges();
				}
			} else {
				if (this.controlCss) {
					this.controlCss = false;
					this.detector.detectChanges();
				}
			}
		});

	}


	public reorderItems(indexes) {
		let element = this.queue.splice(indexes.from, 1)[0];

		// recompute order of element
		if (indexes.to === 0) {
			element.order = this.queue[indexes.to].order / 2;
		} else if (indexes.to === this.queue.length) {
			element.order = this.queue[indexes.to - 1].order + 1000;
		} else {
			let orderTop = this.queue[indexes.to - 1].order;
			let orderBottom = this.queue[indexes.to].order;
			element.order = (orderTop + orderBottom) / 2;
		}

		this.queue.splice(indexes.to, 0, element);
		this.updateQueue(null, element, response => {
			this.store.send(QUEUE.MAP.FETCH);
		});
	}

	public showMore(event) {
		let popover = this.popover.create(MoreMenuPopover, {
			disableButtons: !this.serving,
			isAsst: this.storage.account.role == 2
		});
		popover.present({
			ev: event
		});
		popover.onDidDismiss(response => {
			console.log(response);
			switch (response) {
				case 2:
					this.toggleReOrder();
					break;
				case 1:
					this.removeBtn.click();
					break;
				case 0:
					this.queueAgainBtn.click();
					break;
			}
		});
	}

	public view(patientId) {
		this.rootNav.push(PatientProfilePage, {patientId: patientId});
	}

	public toggleReOrder() {
		this.isReOrder = !this.isReOrder;
	}

	public updateServing(xhr, callback?, errCallback?) {
		return this.updateQueue(xhr, this.serving, callback, errCallback);
	}

	public updateQueue(xhr, element, callback?, errCallback?) {
		this.updateQueueObservable(element).subscribe(
			response => {
				this.store.fetchQueue(
					response => {
						if (xhr) {
							xhr.dismissLoading();
						}
						if (callback) {
							callback();
						}
					}, err => {
						if (xhr) {
							xhr.dismissLoading();
						}
						if (errCallback) {
							errCallback();
						}
					})
			}, err => {
				if (xhr) {
					xhr.dismissLoading();
				}
				if (errCallback) {
					errCallback();
				}
			})
	}

	public updateQueueObservable(element) {
		return this.service.updateQueue(element);
	}

	public done(xhr) {
		this.serving.status = QUEUE.STATUS.DONE;
		this.servingState = 'done';
		this.updateServing(xhr, () => {
			this.store.send(QUEUE.MAP.DONE);
		});
	}

	public next(xhr) {
		this.preHookServingDone().then(response => {
			if (response) {
				for (var i = 0; i < this.queue.length; i++) {
					if (this.queue[i].status === QUEUE.STATUS.QUEUED &&	
						this.queue[i].canServeNow) {
						let serving = Object.assign({}, this.queue.splice(i, 1)[0]);
						serving.status = QUEUE.STATUS.SERVING
						serving.queuedBy = this.storage.account.userId;
						this.updateQueue(xhr, serving, () => {
							this.store.send(QUEUE.MAP.NEXT);
							this.serving = serving;
							xhr.dismissLoading();
						});
						return;
					}else{
						xhr.dismissLoading();
					}
				}
			} else {
				xhr.dismissLoading();
			}
		});
	}

	public hasForQueue() {
		this.canQueue = Boolean(this.queue.find(item => {
			return item.status === QUEUE.STATUS.QUEUED && item.canServeNow;
		}));
	}

	public queueAgain(xhr) {
		this.serving.status = QUEUE.STATUS.EN_ROUTE;
		this.servingState = 'reque';
		this.updateServing(xhr, () => {
			this.store.send(QUEUE.MAP.DONE);
		});
	}

	public noShow(xhr) {
		this.serving.status = QUEUE.STATUS.NO_SHOW;
		this.servingState = 'done';
		this.updateServing(xhr, () => {
			this.store.send(QUEUE.MAP.DONE);
		});
	}

	private addNewPatient() {
		let callback = new EventEmitter<any>();
		this.nav.push(PatientInformationPage, { callback: callback });
		callback.subscribe(response => {
			this.addOrEditQueue(response);
		})
	}

	public addOrEditQueue(customer?: any) {
		console.log(customer);
		let modal = this.modal.create(AddQueueFormModal, customer);
		modal.onDidDismiss(item => {
			if (!item) {
				return;
			}
			let loading = this.createLoading();
			loading.present();

			var parameter: any = item;
			let parameterFactory = new Promise((resolve, reject) => {

				parameter.boardId = this.store.queueBoard.id;

				if (item.isServeNow) {
					parameter.type = QUEUE.TYPE.WALKIN;
					parameter.order = this.getNewOrder();
					parameter.time = new Date();
					parameter.status = QUEUE.STATUS.QUEUED;
					resolve(parameter);
				} else {
					this.service.getQueueBoardByIdAndClinic(this.clinicId, new Date(item.schedule))
						.subscribe(response => {
							if (response.status) {
								parameter.type = QUEUE.TYPE.SCHEDULED;
								parameter.boardId = response.result.id;
								parameter.order = 0,
									parameter.time = this.parseTimeSlot(item.timeSlot);
								parameter.status = QUEUE.STATUS.EN_ROUTE;
								resolve(parameter);
							} else {
								reject(parameter);
							}
						}, err => {
							reject(err);
						})
				}
			})

			parameterFactory.then(parameter => {
				let serviceCallback;
				// if (customer) {
				// 	serviceCallback = this.service.updateQueue(parameter)
				// } else {
				serviceCallback = this.service.addQueue(parameter)
				// }
				serviceCallback.subscribe(
					response => {
						if (response.status) {
							this.store.send(QUEUE.MAP.FETCH);
							this.store.fetchQueue(response => {
								loading.dismiss();
							}, err => {
								loading.dismiss();
							})
						} else {
							loading.dismiss();
						}
					}, err => {
						loading.dismiss();
					});
			}, err => {
				loading.dismiss();
			});
		});
		modal.present();
	}

	public getDefaultAvatar(patient) {
		return Utilities.getDefaultAvatar(patient);
	}

	private getNewOrder() {
		return 1000 + (this.queue && this.queue.length ? this.queue[this.queue.length - 1].order : 0);
	}

	private parseTimeSlot(timeSlot) {
		if (timeSlot && (/[0-9]{0,2}\:[0-9]{0,2}/).test(timeSlot)) {
			let token = timeSlot.split(":");
			let time = new Date();
			time.setHours(token[0]);
			time.setMinutes(token[1]);
			time.setSeconds(0);
			time.setMilliseconds(0);
			return time;
		} else {
			return;
		}
	}

	private getTypeIcon(customer) {
		return customer.type === 'W' ? 'walk' : 'time';
	}

	private getStatusIcon(customer) {
		switch (customer.status) {
			case QUEUE.STATUS.EN_ROUTE:
				return 'car';
			case QUEUE.STATUS.QUEUED:
				return 'flag';
			case QUEUE.STATUS.OUT:
				return 'cafe';
		}
	}

	private serveNow(xhr, customer) {
		this.preHookServingDone().then(response => {
			if (response) {
				let serving = Object.assign({}, customer);
				serving.status = QUEUE.STATUS.SERVING
				this.updateQueue(xhr, serving, () => {
					this.store.send(QUEUE.MAP.NEXT);
					this.serving = serving;
				});
			} else {
				xhr.dismissLoading();
			}
		});
	}

	private preHookServingDone() {
		return new Promise((resolve, reject) => {
			if (this.serving) {
				this.alert.create({
					message: 'You are currently serving ' + this.serving.lastName + ", " + this.serving.firstName + " " + this.serving.middleName + ", are you sure you want to get the next queue and tag current as done?",
					buttons: [
						{
							text: 'No',
							role: 'cancel',
							handler: () => {
								resolve(false);
							}
						},
						{
							text: 'Yes',
							handler: () => {
								this.serving.status = QUEUE.STATUS.DONE;
								this.updateQueueObservable(this.serving).subscribe(response => {
									resolve(response);
								}, err => {
									reject(err);
								});
							}
						}
					]
				}).present();
			} else {
				resolve(true)
			}
		});
	}

	private delete(xhr, customer) {
		customer.status = QUEUE.STATUS.NO_SHOW;
		this.updateQueue(xhr, customer, () => {
			this.store.send(QUEUE.MAP.DONE);
		});
	}

	private arrived(xhr, customer) {
		customer.status = QUEUE.STATUS.QUEUED;
		this.updateQueue(xhr, customer, () => {
			this.store.send(QUEUE.MAP.DONE);
			this.hasForQueue();
		});
	}

	private out(xhr, customer) {
		customer.status = QUEUE.STATUS.OUT;
		this.updateQueue(xhr, customer, () => {
			this.store.send(QUEUE.MAP.DONE);
			this.hasForQueue();
		});
	}

	private getButtons(customer) {
		let isHere = customer.status === QUEUE.STATUS.QUEUED;
		return [
			{
				name: isHere ? 'Away' : 'Arrived',
				icon: isHere ? 'cafe' : 'flag',
				clickFn: (xhr, customer) => {
					if (isHere) {
						return this.out(xhr, customer);
					} else {
						return this.arrived(xhr, customer);
					}
				}
			}
		]
	}

	private TrackByPatientId(index: number, item: any) {
		return item.id;
	}

	private createLoading(): Loading {
		return this.loadingCtrl.create({
			spinner: 'crescent',
			cssClass: 'xhr-loading'
		});
	}

	private goToSchedule() {
		this.rootNav.push(ScheduleHistoryPage);
	}

	private AddPatientDetails(parameter) {
		let serviceCallback;
		let result;

		this.patient.firstname = parameter.firstName;
		this.patient.middlename = parameter.middleName;
		this.patient.lastname = parameter.lastName;
		serviceCallback = this.service.addPatientDetails(this.patient).subscribe(response => {
			if (response.status) {
				result = response.result.id;
			}
			else {
				result = null;
			}
		});

		return result;

		// serviceCallback.subcsribe(response => {

		// 	if(response.status){
		// 		return response.result.id;
		// 	}
		// 	else{
		// 		return null;
		// 	}
		// })
	}

}