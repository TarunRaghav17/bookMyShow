import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-list-your-show-landing-page',
  standalone: false,
  templateUrl: './list-your-show.component.html',
  styleUrl: './list-your-show.component.scss'
})
export class ListYourShowComponent {
  @ViewChild('cityModal', { static: true }) content!: TemplateRef<any>;
  constructor(private modalService: NgbModal) {

  }

  /**
    * @description open service modal 
    * @author  Gurmeet Kumar
    */

  openCityModal(content: TemplateRef<any>) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
    });
  }
}
