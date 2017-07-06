import { Component } from '@angular/core';
import { ScheduleService } from './schedule-history.service';
import { Storage } from '../../services';
import { Utilities } from '../../utilities/utilities';
import { QUEUE } from '../../constants/constants'
import { NavController } from 'ionic-angular';
import { PatientProfilePage } from '../patient-profile/patient-profile.page';

@Component({
	selector: 'schedule-history',
	templateUrl: 'schedule-history.html',
	providers: [ScheduleService]
})
export class ScheduleHistoryPage {
	public queue: any[];
	private queueBoard: any;
	private myDate: any = Utilities.clearTime(new Date()).toISOString();
	private clinicId: any;
	private ongoingHttp: any;
	constructor(
		private service: ScheduleService,
		private storage: Storage,
		private nav: NavController) {
		// this.myDate.setValue(Utilities.clearTime(new Date()).toISOString());
		this.storage.clinicSubject.subscribe(clinic => {

			this.clinicId = clinic.clinicId;
			this.fetchHistory();
		})
	}

	private fetchHistory() {
		this.queue = null;
		if(this.ongoingHttp){
			this.ongoingHttp.unsubscribe();
		}
		this.ongoingHttp = this.service.getQueueBoardByClinicAndDateNoCreate(this.clinicId, new Date(this.myDate)).subscribe(response => {

			if (response.status) {
				//set queue board
				this.queueBoard = response.result;
				this.ongoingHttp = this.fetchQueue(response => {
						console.log("fetched Queue");
					});
			}
		}, err => {
			console.error(err);
		})
	}

	private fetchQueue(callback?, errorHandler?) {
		return this.service.getQueueByBoardID(this.queueBoard.id).subscribe(response => {
			if (response.status) {
				let newQueueList = [];
				for (let item of response.result) {
					newQueueList.push(item);
				}

				this.queue = newQueueList;
				if (callback) {
					callback(response);
				}
			}
		}, err => {
			if (errorHandler) {
				errorHandler(err);
			}
		})
	}

	private getStatus(customer) {
		switch (customer.status) {
			case QUEUE.STATUS.EN_ROUTE:
				return 'En Route';
			case QUEUE.STATUS.OUT:
				return 'Out';
			case QUEUE.STATUS.QUEUED:
				return 'Queued';
			case QUEUE.STATUS.SERVING:
				return 'Serving';
			case QUEUE.STATUS.DONE:
				return 'Done';
		}
	}

	private getType(customer) {
		switch (customer.type) {
			case QUEUE.TYPE.SCHEDULED:
				return 'Scheduled';
			case QUEUE.TYPE.WALKIN:
				return 'Walk-In';
		}
	}

	private getNextDay() {
		var addDay = new Date(this.myDate);
		addDay.setDate(addDay.getDate() + 1);

		this.myDate = addDay.toISOString();
	}

	private getPreviousDay() {
		var addDay = new Date(this.myDate);
		addDay.setDate(addDay.getDate() - 1);

		this.myDate = addDay.toISOString();
	}


	public view(patientId) {
		this.nav.push(PatientProfilePage, {patientId: patientId});
	}


}