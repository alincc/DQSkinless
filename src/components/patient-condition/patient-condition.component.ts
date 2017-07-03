import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams, ViewController } from 'ionic-angular';
import { ArraySubject } from '../../shared/model/model';
import { ConditionModal } from '../condition-modal/condition-modal.component';

@Component({
  selector: 'patient-condition',
  templateUrl: 'patient-condition.html'
})
export class PatientCondition {

  @Input() condition: any;
  @Input() patientId: any;
  private conditions: ArraySubject = new ArraySubject([]);

  constructor(
    private modalController: ModalController,
    private params: NavParams,
    private view: ViewController
  ) {

  }

  public removeItem(event: Event, item, idx) {
    event.preventDefault();

    this.conditions.splice(idx, 1);
    //call delete service api


  }

  public addCondition(event: Event): void {
    event.preventDefault();

    let modal = this.modalController.create(ConditionModal);

    modal.onDidDismiss(condition => {
      if (condition) {
        condition.patientId = this.patientId;
        
        //temporary
        this.conditions.push(condition);
        //call add service api
        
      }
    });
    if (!isNaN(this.patientId)) {
      modal.present();
    }
  }

  public ngOnInit(){
     this.patientId = this.params.get('patientId');
  }

  private bindDetails(){
    this.condition.patientId = this.patientId;
  }

  private getPatientAllergy(){

  }

}
