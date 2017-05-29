import { Injectable } from '@angular/core';
import { HttpService, Storage } from '../../services';
import { CONFIG } from '../../config/config'

@Injectable()
export class PatientService{
    constructor(
        private http: HttpService,
        private storage: Storage) { }

        
}