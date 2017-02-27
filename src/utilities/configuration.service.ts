import { Injectable } from '@angular/core';

import { config } from '../config/config'

@Injectable()
export class ConfigurationService {	

	constructor() { }

	getConfig(): any {
		return config;
	}
}