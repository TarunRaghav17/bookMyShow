import { Component, OnInit } from '@angular/core';
import { VenuesService } from '../create-venue/venues-services/venues.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../services/common.service';

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
  userSelectedCity: string  = "";
  userSelectedVenueType: string  = "";

  cityList: any[] = [];






  constructor(public venueService: VenuesService,
    private toaster: ToastrService,
    private commonService: CommonService,
  ) { }

  ngOnInit() {
    this.getAllVenuesList()
    this.getAllCitiesList()
  }
  setUserSelectedVenueType(event: any) {
    this.userSelectedVenueType = event.target.value;
    this.handleFilteredVenuesList()
  }

  setUserSelectedCity(event: any) {
    this.userSelectedCity = event.target.value.toLowerCase();
    this.handleFilteredVenuesList()
  }

  handleFilteredVenuesList() {
  this.filteredVenuesList = this.venuesList.filter((venue: any) => {
    const matchType = this.userSelectedVenueType
      ? venue.venueFor?.toLowerCase() === this.userSelectedVenueType.toLowerCase()
      : true;

    const matchCity = this.userSelectedCity
      ? venue.address?.city?.toLowerCase() === this.userSelectedCity.toLowerCase()
      : true;

    return matchType && matchCity;
  });
}

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

  getAllVenuesList() {
    this.venueService.getAllVenues().subscribe({
      next: (res: any[]) => {
        this.venuesList = res
        console.log(this.venuesList.map((venue:any)=>venue));
      },
      error: (err) => {
        this.toaster.error(err.error.message)
      }
    })

  }

  transformAddress(address: any) {
    if (address) {
      return Object.values(address)
    }

    return 'N/A'
  }

}
