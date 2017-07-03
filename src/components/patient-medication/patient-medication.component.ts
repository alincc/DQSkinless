import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams, ViewController } from 'ionic-angular';
import { ArraySubject } from '../../shared/model/model';
import { MedicationModal } from '../medication-modal/medication-modal.component';

@Component({
  selector: 'patient-medication',
  templateUrl: 'patient-medication.html'
})
export class PatientMedication implements OnInit{

  @Input() medication: any;
  @Input() patientId: any;
  private medications: ArraySubject = new ArraySubject([]);

  constructor(
    private modalController: ModalController,
    private params: NavParams,
    private view: ViewController
  ) {
    
  }

  public removeItem(event: Event, item, idx) {
    event.preventDefault();

    this.medications.splice(idx, 1);
    //call delete service api


  }

  public addMedication(event: Event): void {
    event.preventDefault();

    let modal = this.modalController.create(MedicationModal);

    modal.onDidDismiss(medication => {
      if (medication) {
        medication.patientId = this.patientId;
        
        //temporary
        this.medications.push(medication);
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
    this.medication.patientId = this.patientId;
  }

  private getPatientMedication(){

  }


}
