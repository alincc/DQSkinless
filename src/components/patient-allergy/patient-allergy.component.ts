import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams, ViewController } from 'ionic-angular';
import { ArraySubject } from '../../shared/model/model';
import { AllergyModal } from '../allergy-modal/allergy-modal.component';
import { PatientAllergyService } from './patient-allergy.service';

@Component({
  selector: 'patient-allergy',
  templateUrl: 'patient-allergy.html',
  providers:[PatientAllergyService]
})
export class PatientAllergy implements OnInit{

  @Input() allergy: any;
  @Input() patientId: any;
  private allergies: ArraySubject = new ArraySubject([]);

  constructor(
    private modalController: ModalController,
    private params: NavParams,
    private view: ViewController,
    private patientAllergyService: PatientAllergyService
  ) {
    
  }

  public removeItem(event: Event, item, idx) {
    event.preventDefault();

    this.patientAllergyService.deletePatientAllergyRecord(item.id).subscribe(response => {
      if(response && response.status){
        this.getPatientAllergies();
      }
    })
  }

  public addAllergy(event: Event): void {
    event.preventDefault();

    let modal = this.modalController.create(AllergyModal);

    modal.onDidDismiss(allergy => {
      if (allergy) {
        this.allergy.patientId = this.patientId;
        this.allergy.description = allergy.description
        
        this.createPatientAllergy();
      }
    });
    if (!isNaN(this.patientId)) {
      modal.present();
    }
  }

  public ngOnInit(){
     this.patientId = this.params.get('patientId');
     this.allergy = {};
     this.getPatientAllergies();
  }

  private getPatientAllergies(){
    this.patientAllergyService.getPatientAllergy(this.patientId).subscribe(response => {
      
      if(response && response.status){
        this.allergies.value = response.result;
      }
    });
  }

  private createPatientAllergy(){

    this.patientAllergyService.createPatientAllergy(this.allergy).subscribe(response => {
      if(response && response.status){
        this.getPatientAllergies();
      }
    });
  }


}
