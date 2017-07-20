import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController, NavParams, ViewController } from 'ionic-angular';
import { ArraySubject } from '../../shared/model/model';
import { ConditionModal } from '../condition-modal/condition-modal.component';
import { PatientConditionService } from './patient-condition.service';
import { Utilities } from '../../utilities/utilities';

@Component({
  selector: 'patient-condition',
  templateUrl: 'patient-condition.html',
  providers: [PatientConditionService]
})
export class PatientCondition {

  @Input()
  private model : any[];
  @Output()
  private modelChange : EventEmitter<any> = new EventEmitter<any>();

  @Input() patientId: any;

  constructor(
    private modalController: ModalController,
    private params: NavParams,
    private view: ViewController,
    private patientConditionService: PatientConditionService
  ) {

  }

  public removeItem(event: Event, item, idx) {
    event.preventDefault();

    this.patientConditionService.deletePatientConditionById(item.id).subscribe(response => {
      if(response && response.status){
        this.getPatientConditions();
      }
    })

  }

  public addCondition(event: Event): void {
    event.preventDefault();

    let modal = this.modalController.create(ConditionModal);

    modal.onDidDismiss(condition => {
      if (condition) {
        condition.patientId = this.patientId;
        condition.diagnosed = condition.diagnosed ? Utilities.transformDate(new Date(condition.diagnosed)) : Utilities.transformDate(new Date());
        
        this.createPatientCondition(condition);
        
      }
    });
    if (!isNaN(this.patientId)) {
      modal.present();
    }
  }

  public ngOnInit(){
     this.patientId = this.params.get('patientId');
     
     this.getPatientConditions();
  }

  private getPatientConditions(){

    this.patientConditionService.getPatientConditionByPatientId(this.patientId).subscribe(response => {
      if(response && response.status){        
        this.model = response.result;
        this.modelChange.emit(this.model);
      }
    });

  }

  private createPatientCondition(condition){

    this.patientConditionService.createPatientCondition(condition).subscribe(response => {
      if(response && response.status){
        this.getPatientConditions();
      }
    }, err => {
      
    })
  }

}
