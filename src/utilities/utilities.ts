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

	public static getISODate(date: Date){
		var tzoffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
		var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);
		return localISOTime;
	}

	public static padDigits(number, digits) {
		return Array(Math.max(digits - String(number).length + 1, 0)).join("0") + number;
	}
	public static transformDate(date: Date) {
		const d = new DatePipe('pt-PT').transform(date, 'yyyy-MM-dd');
		return d;
		
	}

	public static transformDate2(date: Date, format: string){
		const d = new DatePipe('pt-PT').transform(date, format);
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
