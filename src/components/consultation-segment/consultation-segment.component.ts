import { Component, Input } from '@angular/core';

import { ConsultationTimeline } from '../consultation-timeline/consultation-timeline.component';

import { ArraySubject } from '../../shared/model/model';

const SEGMENT_LIST = {
	ALLERGIES: 'allergies',
	CONDITION: 'condition',
	MEDICATION: 'medication'
}

@Component({
  selector: 'consultation-segment',
  templateUrl: 'consultation-segment.html'
})
export class ConsultationSegment {

  private segment: string;
  private segmentList: any = SEGMENT_LIST;
  private allergies: any[];
  private condition: any[];
  private medication: any[];

  @Input()
  private patientId;

  constructor() {
  	this.initSegment();
  }

  initSegment(){
  	this.segment = SEGMENT_LIST.ALLERGIES;
  }

}
