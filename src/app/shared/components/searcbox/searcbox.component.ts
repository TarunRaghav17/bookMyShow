import { Component, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-searcbox',
  standalone: false,
  templateUrl: './searcbox.component.html',
  styleUrls: ['./searcbox.component.scss']
})
export class SearcboxComponent {
  currentIndex: number = 0;
  visibleCount: number = 6;

  eventsFilters: any[] = ['Movies', 'Stream', 'Events', 'Plays', 'Sports', 'Activites', "Venues", 'Offers', 'Others']
  private modalRef?: NgbModalRef;

  constructor(private modalService: NgbModal) { }

  open(content: TemplateRef<any>) {
    this.modalRef = this.modalService.open(content, {
      modalDialogClass: 'searchbox',
      ariaLabelledBy: 'modal-basic-title',
    });
  }

  close() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }


  getVisibleFilters() {
    return this.eventsFilters.slice(this.currentIndex, this.currentIndex + this.visibleCount);
  }

  next() {
    if (this.currentIndex + this.visibleCount < this.eventsFilters.length) {
      this.currentIndex++;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
}