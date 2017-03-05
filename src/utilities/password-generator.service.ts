import { Injectable } from '@angular/core';

@Injectable()
export class PasswordGeneratorService {
    
    generatePassword() {
        return Math.random().toString(36).substring(0, 8);
    }
}