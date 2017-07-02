import { Component } from '@angular/core';


@Component({
	selector: 'queue-widget',
	templateUrl: 'queue-widget.html'
})
export class QueueWidgetComponent{
	public doughnutChartLabels:string[] = ['Done', 'Serving', 'Queued', 'Away'];
	public doughnutChartData:number[] = [45, 5, 25, 25];
	public doughnutChartType:string = 'doughnut';
	private doughnutChartOptions:any={
		cutoutPercentage: 70
	}
	private doughnutChartColors:any= [
		{//done
			backgroundColor: '#66BB6A'
		},
		{//serving
			backgroundColor: '#42A5F5'
		},
		{//queued
			backgroundColor: '#FFEE58'
		},
		{//away
			backgroundColor: '#EF5350'
		}
	]
}