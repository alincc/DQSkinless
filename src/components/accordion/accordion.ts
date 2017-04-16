import { Component, Input } from '@angular/core';

@Component({
    selector: 'accordion',
    templateUrl: 'accordion.html'
})
export class Accordion {
    @Input() header: string;
    @Input() subHeader?: string;
    @Input() open?: boolean = false;
}
