import { Component, OnInit, TemplateRef } from '@angular/core';
import { VenuesService } from '../create-venue/venues-services/venues.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../services/common.service';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { concatMap, finalize, from } from 'rxjs';

@Component({
  selector: 'app-list-venues',
  standalone: false,
  templateUrl: './list-venues.component.html',
  styleUrl: './list-venues.component.scss'
})
export class ListVenuesComponent implements OnInit {
  venuesList: any[] = [];
  filteredVenuesList: any[] | null = null;
  venueTypeList: any[] = [
    "Movie", "Sports", "Event", "Activities", "Plays",
  ]
  userSelectedCity: string = "";
  userSelectedVenueType: string = "";
  cityList: any[] = [];
  searchValue: string = '';
  modalRef?: NgbModalRef | null = null;
  venueToDelete: any | null = null;
  bulkDeleteVenuesList: any[] = [];

  constructor(public venueService: VenuesService,
    private toaster: ToastrService,
    private commonService: CommonService,
    private titleService: Title,
    private modalService: NgbModal,
  ) { }

  /**
  * @description life cycle hook  that calls getAllVenuesList & getAllCitiesList.
  * @author Inzamam
  * @returnType void
  */
  ngOnInit() {
    this.titleService.setTitle('Venues List');
    this.getAllVenuesList();
    this.getAllCitiesList();

  }

  ngOnDestroy() {
    this.titleService.setTitle("Book-My-Show");
  }

  /**
  * @description function that set user selected venue type and calls handleFilteredVenuesList .
  * @author Inzamam
  * @param event
  * @returnType void
  */
  setUserSelectedVenueType(event: any) {
    this.userSelectedVenueType = event.target.value;
    this.handleFilteredVenuesList()
  }

  /**
  * @description function to open delete-venue-confirmation modal
  * @author Inzamam
  * @param template reference to open,venueObj clicked 
  */
  openDeleteModal(content: TemplateRef<any>, venue: any) {
    if (this.bulkDeleteVenuesList.length > 1) return
    this.venueToDelete = venue
    this.modalRef = this.modalService.open(content, {
      centered: false,
      backdrop: 'static',
      keyboard: false
    })
  }

  /**
  * @description function to close delete-venue-confirmation modal
  * @author Inzamam
  */
  closeDeleteModal() {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    }
  }
  /**
* @description function to hit deleteVenueById api 
* @author Inzamam
*/
  deleteVenueById() {
    this.venueService.deleteVenueById(this.venueToDelete.id).subscribe({
      next: (res) => {
        this.toaster.success(res.message)
      },
      error: (err) => {
        this.toaster.error(err.error.message)
      },
      complete: () => {
        this.closeDeleteModal();
        this.userSelectedCity = "";
        this.userSelectedVenueType = "";
        this.filteredVenuesList = null
        this.getAllVenuesList();
      }
    })
  }

  toggleVenueList(event: any, venue: any) {
    if (event.target.checked) {
      this.bulkDeleteVenuesList.push(venue.id)
    }
    else {
      this.bulkDeleteVenuesList = this.bulkDeleteVenuesList.filter((id: any) => id != venue.id)
    }
  }

  deleteMultipleVenues() {
    if (!this.bulkDeleteVenuesList?.length) return;

    from(this.bulkDeleteVenuesList)
      .pipe(
        concatMap((venueId: string) =>
          this.venueService.deleteVenueById(venueId)
        ),
        finalize(() => {
          this.userSelectedCity = "";
          this.userSelectedVenueType = "";
          this.filteredVenuesList = null;
          this.bulkDeleteVenuesList = [];
          this.pageNo = 1;
          this.getAllVenuesList();

          this.toaster.success('All selected venues deleted successfully!');
        })
      )
      .subscribe({
        next: (res: any) => this.toaster.success(res.message),
        error: (err) => this.toaster.error(err.error?.message || 'Error deleting venue')
      });
  }

  /**
    * @description function that set user selected city and calls handleFilteredVenuesList .
    * @author Inzamam
    * @param event
    * @returnType void
    */
  setUserSelectedCity(event: any) {
    this.userSelectedCity = event.target.value
    this.handleFilteredVenuesList()
  }
  /**
    * @description function that handles filtered venues list
    * @author Inzamam
    * @returnType  filtered venues list
    */
  handleFilteredVenuesList() {
    this.pageNo = 1;
    this.filteredVenuesList = this.venuesList.filter((venue: any) => {
      const matchType = this.userSelectedVenueType
        ? venue.venueType == this.userSelectedVenueType
        : true;
      const matchCity = this.userSelectedCity
        ? venue.address?.cityName == this.userSelectedCity
        : true;
      return matchType && matchCity;
    });
    this.getVisibleCards();
  }
  /**
    * @description function that fetches all cities list from api.
    * @author Inzamam
    * @returnType void
    */
  getAllCitiesList() {
    this.commonService.getAllCities().subscribe(
      {
        next: (res) => {
          this.cityList = res.data;
        },
        error: (err) => {
          this.toaster.error(err.error.message)
        }
      }
    )
  }

  /**
    * @description function that fetches all venues list from api.
    * @author Inzamam
    * @returnType void
    */
  getAllVenuesList() {
    this.venueService.getAllVenues().subscribe({
      next: (res: any) => {
        this.venuesList = res.data.reverse();
        this.getVisibleCards();
      },
      error: (err) => {
        this.toaster.error(err.error.message)
      }
    })
  }

  /**
  * @description function that takes address obj & returns an array of that obj values else 'N/A'
  * @author Inzamam
  * @params address obj
  * @returnType array of obj values
  */
  transformAddress(address: any): string {
    if (!address) return "N/A";
    let parts: any[] = [];
    Object.values(address).forEach((val: any) => {
      if (typeof val === "object" && val !== null) {
        parts.push(...Object.values(val));
      } else {
        parts.push(val);
      }
    });
    return parts.join(", ");
  }

  itemsPerPage = 20;
  pageNo = 1;
  visibleData: any[] = [];
  totalPages: number = 0

  getVisibleCards() {
    this.totalPages = Math.ceil(((this.filteredVenuesList || this.venuesList).length / this.itemsPerPage) || 1);
    const pageNo = this.pageNo - 1;
    const start = this.itemsPerPage * pageNo;
    const end = start + this.itemsPerPage;
    this.visibleData = (this.filteredVenuesList || this.venuesList).slice(start, end);
  }

  /**
   * @description validate & increment the pageNo by 1
   */
  next() {
    if (this.pageNo < this.totalPages) {
      this.pageNo++;
      this.getVisibleCards()
    }
  }

  /**
   * @description validate & decrement the pageNo by 1
  */
  prev() {
    if (this.pageNo > 1) {
      this.pageNo--;
      this.getVisibleCards()
    }
  }
}