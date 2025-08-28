import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-searchBox',
  standalone: false,
  templateUrl: './searchBox.component.html',
  styleUrls: ['./searchBox.component.scss']
})
export class SearchBoxComponent implements OnInit {
  currentIndex: number = 0;
  visibleCount: number = 6;
  filtreData: any;
  eventsFilters: any[] = ['Movies', 'Stream', 'Events', 'Plays', 'Sports', 'Activites', "Venues", 'Offers', 'Others']
  private modalRef?: NgbModalRef;

  constructor(private modalService: NgbModal) { }



  ngOnInit(): void {
    this.getVisibleFilters()
  }
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

  /**  
   * @description .  
   * @author Gurmeet 
   * @return {string} Return a string  
   */

  getVisibleFilters() {
    this.filtreData = this.eventsFilters.slice(this.currentIndex, this.currentIndex + this.visibleCount);
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