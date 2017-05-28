import { Component, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ScheduleService } from './schedule.service';
import { Storage } from '../../services';
import { Utilities } from '../../utilities/utilities';
import { QUEUE } from '../../constants/constants'

@Component({
	selector: 'schedule-history',
	templateUrl: 'schedule-history.html',
	providers: [ScheduleService]
})
export class ScheduleHistoryPage {
	public scheduleForm: FormGroup;
	public queue: any[];
	private ws: any;
	private connection: any;
	private queueBoard: any;
	private myDate: String = Utilities.getISODate(new Date());
	private clinicId: any;
	constructor(
		private service: ScheduleService,
		private storage: Storage,
		private detector: ChangeDetectorRef,
		private formBuilder: FormBuilder) {

		// this.myDate.setValue(Utilities.clearTime(new Date()).toISOString());
		this.storage.clinicSubject.subscribe(clinic => {

			this.clinicId = clinic.clinicId;
			this.fetchHistory();
		})

	}

	private fetchHistory() {

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
				this.detector.detectChanges();
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
				return 'Wakn-In';
		}
	}

	private getNextDay() {
		var addDay = new Date(this.myDate.toString());
		addDay.setDate(addDay.getDate() + 1);

		this.myDate = addDay.toISOString();
	}

	private getPreviousDay() {
		var addDay = new Date(this.myDate.toString());
		addDay.setDate(addDay.getDate() - 1);

		this.myDate = addDay.toISOString();
	}


}