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
	private myDate: String = Utilities.getISODateToday();
	private clinicId: any;
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
		this.service.getQueueBoardByClinicAndDateNoCreate(this.clinicId, Utilities.clearTime(new Date(this.myDate.toString()))).subscribe(response => {

			if (response.status) {
				//set queue board
				this.queueBoard = response.result;
				this.fetchQueue(response => {
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
		var addDay = new Date(this.myDate.toString());
		addDay.setDate(addDay.getDate() + 1);

		this.myDate = Utilities.getISODate(addDay);
	}

	private getPreviousDay() {
		var addDay = new Date(this.myDate.toString());
		addDay.setDate(addDay.getDate() - 1);

		this.myDate = Utilities.getISODate(addDay);
	}


	public view(patientId) {
		this.nav.push(PatientProfilePage, patientId);
	}


}