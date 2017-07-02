import { Component, ChangeDetectorRef } from '@angular/core';
import { QueueStore } from '../../store';
import { QUEUE } from '../../constants/constants'

@Component({
	selector: 'queue-widget',
	templateUrl: 'queue-widget.html'
})
export class QueueWidgetComponent{
	public doughnutChartLabels:string[] = ['Done', 'Serving', 'Queued', 'Away'];
	public queueBreakdown:number[] = [0, 0, 0, 0];
	public queueTotal: number;
	private doughnutChartOptions:any={
		cutoutPercentage: 70
	}
	private doughnutChartColors:any= [{
		backgroundColor: [
			//done
				'#66BB6A',
			//serving
				'#42A5F5',
			//queued
				'#FFEE58',
			//away
				'#EF5350'
		]
	}];


	constructor(private store : QueueStore,
		private detector: ChangeDetectorRef){
		store.queueListSubject.subscribe( queueList => {
			if(queueList){
	 			let queueBreakdown = [0, 0, 0, 0];
	 			this.queueTotal = 0;
	 			for(let queue of queueList){
	 				this.queueTotal++;
	 				switch (queue.status) {
					case QUEUE.STATUS.SERVING:
						queueBreakdown[1]++;
						break;
					case QUEUE.STATUS.QUEUED:
						queueBreakdown[2]++;
						break;
					case QUEUE.STATUS.EN_ROUTE:
					case QUEUE.STATUS.OUT:
						queueBreakdown[3]++;
						break;
					default:
						queueBreakdown[0]++;
						break;
					}
	 			}
	 			this.queueBreakdown = queueBreakdown;
	 			try{
					detector.detectChanges();
				}catch(err){
					detector.reattach();
				}
			}
		})
	}
}