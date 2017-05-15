import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

export class Utilities {

	public static clearTime(date: Date) {
		let timeless = new Date(date.getTime());
		timeless.setMilliseconds(0);
		timeless.setSeconds(0);
		timeless.setMinutes(0);
		timeless.setHours(0);
		return timeless;
	}


	public static getISODate(date: Date) {
		let isoDate: String = date.getFullYear() + "-" + this.padDigits(date.getMonth() + 1, 2) + "-" + date.getDate() + "T00:00:00.000Z";
		return isoDate;
	}

	public static padDigits(number, digits) {
		return Array(Math.max(digits - String(number).length + 1, 0)).join("0") + number;
	}
	public static transformDate(date: Date) {
		const d = new DatePipe('pt-PT').transform(date, 'yyyy-MM-dd');
		return d;
		
	}
}

export class StackedServices {

	private stack: Observable<any>[];

	constructor(stack: Observable<any>[]) {
		this.stack = stack;
	}

	public push(observable: Observable<any>) {
		this.stack.push(observable);
	}

	public executeFork() {
		return Observable.forkJoin(this.stack);
	}

	public get lastIndex() {
		return this.stack.length - 1;
	}

	public shiftStack() {
		if (this.canShift()) {
			this.stack.shift();
		}
	}

	public clearStack() {
		this.stack = [];
	}

	private canShift() {
		return this.stack && this.stack.length >= 1;
	}
}
