import { Component, OnInit } from '@angular/core';
import { VenuesService } from '../create-venue/venues-services/venues.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../services/common.service';
import { Title } from '@angular/platform-browser';

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

  constructor(public venueService: VenuesService,
    private toaster: ToastrService,
    private commonService: CommonService,
    private titleService: Title,
  ) { }

  /**
  * @description life cycle hook  that calls getAllVenuesList & getAllCitiesList.
  * @author Inzamam
  * @returnType void
  */
  ngOnInit() {
    this.titleService.setTitle('Venues List')
    this.getAllVenuesList()
    this.getAllCitiesList()
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
    this.filteredVenuesList = this.venuesList.filter((venue: any) => {
      const matchType = this.userSelectedVenueType
        ? venue.venueType == this.userSelectedVenueType
        : true;
      const matchCity = this.userSelectedCity
        ? venue.address?.cityName == this.userSelectedCity
        : true;
      return matchType && matchCity;
    });
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
        this.venuesList = res.data
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
}