import { Component, OnInit, Input } from '@angular/core';
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

  @Input() medication: any;
  @Input() patientId: any;
  private medications: ArraySubject = new ArraySubject([]);

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
        this.medication.patientId = this.patientId;
        this.medication.description = medication.description;
        this.medication.startDate = medication.startDate ? Utilities.transformDate(new Date(medication.startDate)) : Utilities.transformDate(new Date());
                
        this.createPatientMedication();
        
      }
    });
    if (!isNaN(this.patientId)) {
      modal.present();
    }
  }

  public ngOnInit(){
     this.patientId = this.params.get('patientId');
     this.medication = {};
     this.getPatientMedication();
  }

  private getPatientMedication(){

    this.patientMedicationService.getPatientMedicationByPatientId(this.patientId).subscribe(response => {
      if(response && response.status){
        this.medications.value = response.result;
      }
    })
  }

  private createPatientMedication(){

    this.patientMedicationService.createPatientMedication(this.medication).subscribe(response => {
      if(response && response.status){
        this.getPatientMedication();
      }
    })
  }

}
