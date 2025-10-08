import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';


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
  constructor(
    private modalService: NgbModal,
    private commonService: CommonService,
    private router: Router
  ) {
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
      centered: true
    });
    this.serviceContent = data
  }
  /**
    * @description Close current openModal  
    * @author  Gurmeet Kumar
    */

  closemodal() {
    this.modalService.dismissAll();
  }
  /**
    * @description Close current openModal  
    * @author  Gurmeet Kumar
    * @param eventType
   */
  setEventType(eventType: string) {
    this.router.navigate(['/admin/create/content'], { state: { contentTypeName: eventType } });
  }


}
