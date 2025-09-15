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

  searchObj: any = {
    name: '',
    eventTypes: [],
  };
  private modalRef?: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private homeService: HomeService
  ) {}

  ngOnInit(): void {
    this.seachControl.valueChanges
      .pipe(
        debounceTime(300),
        tap((query: string) => {
          this.searchObj.name = query; // only update name
        }),
        switchMap(() => this.homeService.globalSearch(this.searchObj))
      )
      .subscribe({
        next: (res: any) => {
          this.movieName= res.data
          console.log(res);
        },
      });
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

addFilters(eventType: string) {
  const index = this.searchObj.eventTypes.indexOf(eventType);
  if (index === -1) {
    this.searchObj.eventTypes.push(eventType);
  } else {
    this.searchObj.eventTypes.splice(index, 1);
  }
}

}
