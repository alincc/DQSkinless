import { Component } from '@angular/core';

import { ConsultationTimeline } from '../consultation-timeline/consultation-timeline.component';

import { ArraySubject } from '../../shared/model/model';

@Component({
  selector: 'consultation-segment',
  templateUrl: 'consultation-segment.html'
})
export class ConsultationSegment {

  private segment: string;

  constructor() {
    this.segment = 'segment1';
  }

}
