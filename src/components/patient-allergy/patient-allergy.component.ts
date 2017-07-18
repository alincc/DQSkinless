import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController, ViewController } from 'ionic-angular';
import { AllergyModal } from '../allergy-modal/allergy-modal.component';
import { PatientAllergyService } from './patient-allergy.service';

@Component({
  selector: 'patient-allergy',
  templateUrl: 'patient-allergy.html',
  providers:[PatientAllergyService]
})
export class PatientAllergy{

  @Input()
  private model : any[];
  @Output()
  private modelChange : EventEmitter<any> = new EventEmitter<any>();

  @Input()
  private patientId: number;

  constructor(
    private modalController: ModalController,
    private view: ViewController,
    private patientAllergyService: PatientAllergyService
  ) {}

  public removeItem(event: Event, item) {
    event.preventDefault();
    this.patientAllergyService.deletePatientAllergyRecord(item.id).subscribe(response => {
      if(response && response.status){
        this.getPatientAllergies();
      }
    })
  }

  public addAllergy(event: Event): void {
    event.preventDefault();
    if (!isNaN(this.patientId)) {
      let modal = this.modalController.create(AllergyModal);
      modal.onDidDismiss(allergy => {
        if (allergy) {
          allergy.patientId = this.patientId;
          allergy.description = allergy.description
          this.createPatientAllergy(allergy);
        }
      });
      modal.present();
    }
  }

  public ngAfterViewInit(){
     if(!this.model && !isNaN(this.patientId)){
       this.getPatientAllergies();
     }
  }

  private getPatientAllergies(){
    this.patientAllergyService.getPatientAllergy(this.patientId).subscribe(response => {
      if(response && response.status){
        this.model = response.result;
        this.modelChange.emit(this.model);
      }
    });
  }

  private createPatientAllergy(allergy){
    this.patientAllergyService.createPatientAllergy(allergy).subscribe(response => {
      if(response && response.status){
        this.getPatientAllergies();
      }
    });
  }


}
