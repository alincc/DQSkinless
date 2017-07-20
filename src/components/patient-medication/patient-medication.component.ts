import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController, NavParams, ViewController } from 'ionic-angular';
import { ArraySubject } from '../../shared/model/model';
import { MedicationModal } from '../medication-modal/medication-modal.component';
import { PatientMedicationService } from './patient-medication.service';
import { Utilities } from '../../utilities/utilities';

@Component({
  selector: 'patient-medication',
  templateUrl: 'patient-medication.html',
  providers: [PatientMedicationService]
})
export class PatientMedication implements OnInit{

  @Input()
  private model : any[];
  @Output()
  private modelChange : EventEmitter<any> = new EventEmitter<any>();

  @Input() patientId: any;

  constructor(
    private modalController: ModalController,
    private params: NavParams,
    private view: ViewController,
    private patientMedicationService: PatientMedicationService
  ) {
    
  }

  public removeItem(event: Event, item, idx) {
    event.preventDefault();

    this.patientMedicationService.deletePatientMedicationById(item.id).subscribe(response => {
      if(response && response.status){
        this.getPatientMedication();
      }
    })

  }

  public addMedication(event: Event): void {
    event.preventDefault();

    let modal = this.modalController.create(MedicationModal);

    modal.onDidDismiss(medication => {
      if (medication) {
        medication.patientId = this.patientId;
        medication.startDate = medication.startDate ? Utilities.transformDate(new Date(medication.startDate)) : Utilities.transformDate(new Date());
                
        this.createPatientMedication(medication);
        
      }
    });
    if (!isNaN(this.patientId)) {
      modal.present();
    }
  }

  public ngOnInit(){
     this.patientId = this.params.get('patientId');     
     this.getPatientMedication();
  }

  private getPatientMedication(){

    this.patientMedicationService.getPatientMedicationByPatientId(this.patientId).subscribe(response => {
      if(response && response.status){
        // this.medications.value = response.result;
        this.model = response.result;
        this.modelChange.emit(this.model);
      }
    })
  }

  private createPatientMedication(medication){

    this.patientMedicationService.createPatientMedication(medication).subscribe(response => {
      if(response && response.status){
        this.getPatientMedication();
      }
    })
  }

}
