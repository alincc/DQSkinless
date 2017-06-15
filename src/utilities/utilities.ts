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

	public static getISODateToday(){
		var tzoffset = (new Date).getTimezoneOffset() * 60000; //offset in milliseconds
		var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);
		return localISOTime;
	}

	public static getISODate(date: Date){
		return new Date(new Date(date).toString() +" GMT").toISOString()
	}

	public static padDigits(number, digits) {
		return Array(Math.max(digits - String(number).length + 1, 0)).join("0") + number;
	}
	
	public static transformDate(date: Date) {
		const d = new DatePipe('pt-PT').transform(date, 'yyyy-MM-dd');
		return d;
	}

	public static getFullName(user) {
		return user.lastname ? (user.lastname ? user.lastname + ', ' : '') + (user.firstname ? user.firstname + ' ' : '') + ' ' + (user.middlename ? user.middlename : '') : 'Unregistered';
	}

	public static getMinDate(): any {
		let dateNow = Utilities.clearTime(new Date());
		dateNow.setDate(dateNow.getDate() + 1);
		const month = dateNow.getMonth().toString();
		return dateNow.getFullYear() + '-' + (month.length < 2 ? '0' : '') + month + '-' + dateNow.getDate();
	}

	public static getAge(dob: number){
		let dateNow = Utilities.clearTime(new Date());
		let birthDate = Utilities.clearTime(new Date(dob));

		let age = dateNow.getFullYear() - birthDate.getFullYear();

		let dateCompare = Utilities.clearTime(new Date(dateNow.setFullYear(dateNow.getFullYear() - age)));

		if(birthDate.getDate() > dateCompare.getDate()){
			age--;
		}

		return age;
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
