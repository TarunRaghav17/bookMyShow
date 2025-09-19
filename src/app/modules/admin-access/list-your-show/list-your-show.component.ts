import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';


@Component({
  selector: 'app-list-your-show-landing-page',
  standalone: false,
  templateUrl: './list-your-show.component.html',
  styleUrl: './list-your-show.component.scss'
})
export class ListYourShowComponent {
  @ViewChild('serviceModal', { static: true }) serviceModal!: TemplateRef<any>;

  serviceData: any[] = []
  serviceContent: any;
  constructor(private modalService: NgbModal, private commonService: CommonService) {
    this.serviceData = this.commonService.listYourShowService

  }

  /**
    * @description open service modal 
    * @author  Gurmeet Kumar
    */

  openCityModal(serviceModal: TemplateRef<any>, data: any) {
    this.modalService.open(serviceModal, {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
    });
    this.serviceContent = data

  }


  closemodal() {
    this.modalService.dismissAll();
  }


}
