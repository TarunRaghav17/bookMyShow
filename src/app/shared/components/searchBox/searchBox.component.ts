import { CommonService } from './../../../services/common.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from '../../../modules/explore/home/service/home.service';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-searchBox',
  standalone: false,
  templateUrl: './searchBox.component.html',
  styleUrls: ['./searchBox.component.scss'],
})
export class SearchBoxComponent implements OnInit {
  currentIndex: number = 0;
  visibleCount: number = 6;
  seachControl: any = new FormControl('');
  selectedFilter:any;
  movieName:any;
  eventsFilters: string[] = ['Movies', 'Events', 'Plays', 'Sports', 'Activities'];

/**
 * @description Search object used for filtering events
 */
searchObj: any = {
  name: '',
  eventTypes: [],
};

/** @description Reference to the currently open modal */
private modalRef?: NgbModalRef;

constructor(
  private modalService: NgbModal,
  private homeService: HomeService,
  public  commonService: CommonService
) {}

ngOnInit(): void {
  this.seachControl.valueChanges
    .pipe(
      debounceTime(300), 
      tap((query: string) => {
        this.searchObj.name = query; 
      }),
      switchMap(() => this.homeService.globalSearch(this.searchObj))
    )
    .subscribe({
      next: (res: any) => {
        this.movieName = res.data || [];
      },
    });
}

/**
 * @description Open search modal & reset event types on every open
 * @param searchFilterModal TemplateRef of the modal
 */
openModal(searchFilterModal: TemplateRef<any>) {
  this.modalRef = this.modalService.open(searchFilterModal, {
    modalDialogClass: 'searchbox',
    ariaLabelledBy: 'modal-basic-title',
  });
  this.searchObj.eventTypes = []; 
}

/**
 * @description Close the currently open modal
 */
closeModal() {
  if (this.modalRef) {
    this.modalRef.close();
  }
}

/**
 * @description Toggle filters by event type (add/remove)
 * @param eventType Selected event type
 */
addFilters(eventType: string) {
  const index = this.searchObj.eventTypes.indexOf(eventType);
  if (index === -1) {
    this.searchObj.eventTypes.push(eventType);
  } else {
    this.searchObj.eventTypes.splice(index, 1);
  }
}

}
