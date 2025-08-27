import { Component, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-searchBox',
  standalone: false,
  templateUrl: './searchBox.component.html',
  styleUrls: ['./searchBox.component.scss']
})
export class SearchBoxComponent {
  currentIndex: number = 0;
  visibleCount: number = 6;

  eventsFilters: any[] = ['Movies', 'Stream', 'Events', 'Plays', 'Sports', 'Activites', "Venues", 'Offers', 'Others']
  private modalRef?: NgbModalRef;

  constructor(private modalService: NgbModal) { }

  openModal(content: TemplateRef<any>) {
    this.modalRef = this.modalService.open(content, {
      modalDialogClass: 'searchbox',
      ariaLabelledBy: 'modal-basic-title',
    });
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  getvisiblefiltred: any
  getVisibleFilters() {
    this.getvisiblefiltred = this.eventsFilters.slice(this.currentIndex, this.currentIndex + this.visibleCount);
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