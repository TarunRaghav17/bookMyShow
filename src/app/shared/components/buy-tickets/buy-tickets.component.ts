import { AfterViewInit, Component } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { DurationPipe } from '../../../core/pipes/duration.pipe';


interface Category {
  categoryName: string;
  categoryPrice: string;
  categoryStatus: string;
}

interface TimeSlot {
  time: string;
  showIds: string[];
  showDateId: string,
  showTimeId: string,
  availableCategories: Category[];
}

interface ShowMapSlot {
  showIds: Set<string>;
  showDateId: string,
  showTimeId: string,
  categoryMap: Map<string, Category>;
}

interface Screen {
  screenId: string;
  showTimesMap: Map<string, ShowMapSlot>;
}

interface Venue {
  venueId: string;
  venueName: string;
  screens: Screen[];
}

@Component({
  selector: 'app-buy-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule,DurationPipe],
  templateUrl: './buy-tickets.component.html',
  styleUrl: './buy-tickets.component.scss'
})
export class BuyTicketsComponent implements AfterViewInit {
  venueShowsDetails: any;
  filteredVenueShowsDetails: any[] | null = null;
  logoArray = [
    './assets/images/movieTimeLogo.png',
    './assets/images/inoxLogo.png',
    './assets/images/pvrLogo.png'
  ]

  constructor(public commonService: CommonService, private route: ActivatedRoute, private router: Router,
    private toaster: ToastrService
  ) { }

  // -------test data------
  maxPrice = 499;
  // ------------------
  selectedMovie = 'movie999'
  movieDetails: any | null = null
  dateSelectionArray: any = [];
  userSelectedDate: any;
  contentId: string | null = null
  isOpen: boolean = false;
  searchValue: string = "";

  selectedFilters: any[] = [];
  priceFilters: any =
    {
      type: 'price',
      data: [' ₹ 0 - 200', ' ₹ 201 - 400', ' ₹ 401 - 600', ' ₹ 601 - 800', ' ₹ 801 - 1000']
    }

  preferedTimeFilters: any = {
    type: 'preferedTime',
    data: ['Morning,00:00-11:59', 'Afternoon,12:00-15:59', 'Evening,16:00-19:59', 'Night,20:00-23:59']
  };

  ngOnInit() {
    this.initializeDateSelectionArray()
    this.commonService.setUserSelectedDate(this.dateSelectionArray[0]);
  }
  ngAfterViewInit() {
    this.fetchContentIdByUrl();
  }

  isChecked(payload: any) {
    let { type, value } = payload;
    this.selectedFilters.some((filter: any) => {
      if (filter.type == type) {
        let res = filter.value == value;
        return res
      }
      return false
    })
  }
  handleFilterChange(event: any, payload: any) {
    let { type, value } = payload;
    switch (type) {
      case 'price': {
        if (event.target.checked) {
          this.selectedFilters.push({ type: type, value: value });
        } else {
          this.selectedFilters = this.selectedFilters.filter(item => item.value !== value);
        }
        break;
      }
      case 'preferedTime': {
        if (event.target.checked) {
          this.selectedFilters.push({ type: type, value: value });
        } else {
          this.selectedFilters = this.selectedFilters.filter(item => item.value !== value);
        }
        break;
      }
    }
    this.getFilteredVenuesShowsList()
  }
  getFilteredVenuesShowsList() {
    if (this.selectedFilters.length == 0) {
      this.filteredVenueShowsDetails = null
    }
    this.selectedFilters.forEach((filter: any) => {
      switch (filter.type) {
        case 'price': {
          let price = filter.value.split('₹')[1];
          const minPrice = Number(price.split('-')[0]);
          const maxPrice = Number(price.split('-')[1]);
          this.filteredVenueShowsDetails = this.venueShowsDetails.filter((venue: any) =>
            venue.screens.some((screen: any) =>
              screen.showTimes.some((showTime: any) =>
                showTime.availableCategories.some((category: any) =>
                  Number(category.categoryPrice) <= maxPrice && Number(category.categoryPrice) >= minPrice
                )
              )
            )
          );
          break;
        }
        case 'preferedTime': {
          const [start, end] = filter.value.split(',')[1].split('-');
          this.filteredVenueShowsDetails = this.venueShowsDetails.filter((venue: any) =>
            venue.screens.some((screen: any) =>
              screen.showTimes.some((showTime: any) =>
                showTime.time >= start && showTime.time <= end
              )
            )
          );
          break;
        }
      }
    });
  }

  /**
* @description function that fetches content details from content id comming from url
* @author Inzamam
*/
  fetchContentIdByUrl() {
    this.contentId = this.route.snapshot.paramMap.get('id');
    this.commonService.getContentDetailsById(this.contentId).subscribe({
      next: (res) => {
        this.movieDetails = res.data;
      },
      error: (err) => {
        this.toaster.error(err.error.message)
      }
    })
    this.fetchVenuesShows(this.contentId);
  }
  /**
* @description helper function to format categories and shows in venues
* @author Inzamam
* @params data[]
* @return venues
*/
  mergeCategoriesWithShowIds(data: any[]): any[] {
    const venueMap = new Map<string, Venue>();

    data.forEach((item) => {
      if (!venueMap.has(item.venueId)) {
        venueMap.set(item.venueId, {
          venueId: item.venueId,
          venueName: item.venueName,
          screens: [],
        });
      }
      const venue = venueMap.get(item.venueId)!;
      let screen = venue.screens.find((s) => s.screenId === item.screenId);
      if (!screen) {
        screen = { screenId: item.screenId, showTimesMap: new Map() };
        venue.screens.push(screen);
      }
      item.shows.forEach((show: any) => {
        const showId = item.showId;
        const time = show.time;
        (show.availableCategories).forEach((timeSlot: any) => {
          if (!screen!.showTimesMap.has(time)) {
            screen!.showTimesMap.set(time, { showIds: new Set(), categoryMap: new Map(), showDateId: show.showDateId, showTimeId: show.showTimeId });
          }
          const slot = screen!.showTimesMap.get(time)!;
          slot.showIds.add(showId);
          [timeSlot].forEach((cat: Category) => {
            if (!slot.categoryMap.has(cat.categoryName)) {
              slot.categoryMap.set(cat.categoryName, { ...cat });
            }
          });
        });
      });
    });
    const venues: any[] = Array.from(venueMap.values()).map((venue) => (
      {
        ...venue,
        screens: venue.screens.map((screen) => ({
          screenId: screen.screenId,
          showTimes: Array.from(screen.showTimesMap.entries()).map(
            ([time, slot]: [string, ShowMapSlot,]): TimeSlot => ({
              time,
              showIds: Array.from(slot.showIds),
              availableCategories: Array.from(slot.categoryMap.values()),
              showDateId: slot.showDateId,
              showTimeId: slot.showTimeId
            })
          )
        })),
      }));
    return venues;
  }

  /**
* @description function to get shows and venues by contentId and stores in venueShowsDetails
* @author Inzamam
* @params contentId 
*/
  fetchVenuesShows(contentId: string | null) {
    this.userSelectedDate = this.commonService.userSelectedDate()
    this.commonService.getVenuesShowsByContentId(contentId, this.userSelectedDate?.today).subscribe({
      next: (res) => {
        this.venueShowsDetails = this.mergeCategoriesWithShowIds(res.data);
      },
      error: (err) => {
        this.toaster.error(err.error.message)
      }
    })
  }

  /**
* @description helper function to handle date change
* @author Inzamam
* @params payload:index,date obj
*/
  onDateChange(index: number, dateObj: any) {
    if (index < 4 && this.commonService.getUserSelectedDate() != dateObj) {
      this.commonService.setUserSelectedDate(dateObj);
      this.fetchVenuesShows(this.contentId);
    }
    return
  }

  /**
* @description sets user seleced venue screen and show time and then navigate to seat layout page
* @author Inzamam
* @params payload:venue, screen, showTime
*/
  navigateToSeatLayout(venue: Venue, screen: Screen, showTime: TimeSlot) {
    this.commonService.setUserSelectedShow({ ...showTime, screenId: screen.screenId });
    let screenShows = this.venueShowsDetails.filter((venueShow: any) => venueShow.venueId == venue.venueId)[0].screens
    this.router.navigate([`/movies/city-${this.commonService._selectCity()?.toLowerCase()}/seat-layout/eventId-${this.movieDetails?.eventId}/venueId-${venue.venueId}/screenId-${screen.screenId}/showId-${this.commonService.userSelectedShow()?.showIds[0]}/showDateId-${this.commonService.userSelectedShow()?.showDateId}/showTimeId-${this.commonService.userSelectedShow()?.showTimeId}/date-${this.commonService.userSelectedDate()?.today}`], { state: { screenShows: screenShows, venueId: venue.venueId } });
  }

  /**
* @description function that initializes dateSelectionArray
* @author Inzamam
*/
  initializeDateSelectionArray() {
    let today = new Date();
    for (let i = 0; i < 7; i++) {
      let dateObj = new Date();
      dateObj.setDate(today.getDate() + i)
      this.dateSelectionArray.push({
        day: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
        dateNum: dateObj.getDate(),
        month: dateObj.toLocaleDateString('en-US', { month: 'short' }),
        today: dateObj.toISOString().split('T')[0]
      })
    }
  }
  /**
* @description function that open/close search venue box
* @author Inzamam
* @params payload:event,value(true or false)
*/
  toggleSearchBox(event: any, value: boolean) {
    event.stopPropagation()
    this.isOpen = value;
    if (!this.isOpen) {
      this.searchValue = ""
    }
  }
}