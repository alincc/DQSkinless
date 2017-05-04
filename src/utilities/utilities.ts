export class Utilities{

	public static clearTime( date : Date ){
		let timeless = new Date(date.getTime());
		timeless.setMilliseconds(0);
    	timeless.setSeconds(0);
      	timeless.setMinutes(0);
      	timeless.setHours(0);
      	return timeless;
	}

}