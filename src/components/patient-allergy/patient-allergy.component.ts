import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams, ViewController } from 'ionic-angular';
import { ArraySubject } from '../../shared/model/model';
import { AllergyModal } from '../allergy-modal/allergy-modal.component';

@Component({
  selector: 'patient-allergy',
  templateUrl: 'patient-allergy.html'
})
export class PatientAllergy implements OnInit{

  @Input() allergy: any;
  @Input() patientId: any;
  private allergies: ArraySubject = new ArraySubject([]);

  constructor(
    private modalController: ModalController,
    private params: NavParams,
    private view: ViewController
  ) {
    
  }

  public removeItem(event: Event, item, idx) {
    event.preventDefault();

    this.allergies.splice(idx, 1);
    //call delete service api


  }

  public addAllergy(event: Event): void {
    event.preventDefault();

    let modal = this.modalController.create(AllergyModal);

    modal.onDidDismiss(allergy => {
      if (allergy) {
        allergy.patientId = this.patientId;
        
        //temporary
        this.allergies.push(allergy);
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
    this.allergy.patientId = this.patientId;
  }

  private getPatientAllergy(){

  }


}
