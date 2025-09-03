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
  filterData: any;
  eventsFilters: any[] = ['Movies', 'Stream', 'Events', 'Plays', 'Sports', 'Activites', "Venues", 'Offers', 'Others']
  private modalRef?: NgbModalRef;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getVisibleFilters()
  }

  /**
    * @description openModal 
    * @author Gurmeet Kumar
    */
  openModal(searchFilterModal: TemplateRef<any>) {
    this.modalRef = this.modalService.open(searchFilterModal, {
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
   * @author Gurmeet Kumar
   * @return {string} Return a string  
   */

  getVisibleFilters() {
    this.filterData = this.eventsFilters.slice(this.currentIndex, this.currentIndex + this.visibleCount);
  }

  /**
    * @description next i have click to get 6 cardsData
    * @author Gurmeet Kumar,
    */
  next() {
    if (this.currentIndex + this.visibleCount < this.eventsFilters.length) {
      this.currentIndex++;
    }
  }
  /**
   * @description prev i have click to get  back 6 cardsData
   * @author Gurmeet Kumar,
   */

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
}