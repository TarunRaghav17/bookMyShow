import { AfterViewInit, Component } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';


interface Category {
  categoryName: string;
  categoryPrice: string;
  categoryStatus: string;
}

interface TimeSlot {
  time: string;
  showIds: string[];
  availableCategories: Category[];
}

interface ShowMapSlot {
  showIds: Set<string>;
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
  imports: [CommonModule, FormsModule],
  templateUrl: './buy-tickets.component.html',
  styleUrl: './buy-tickets.component.scss'
})
export class BuyTicketsComponent implements AfterViewInit {
  venueShowsDetails: any;
  filteredVenueShowsDetails: any[] | null = null;

  constructor(public commonService: CommonService, private route: ActivatedRoute, private router: Router,
    private toaster: ToastrService
  ) { }

  // -------test data------
  maxPrice = 900;
  // ------------------
  selectedMovie = 'movie999'
  movieDetails: any | null = null
  dateSelectionArray: any = [];
  userSelectedDate: any;
  contentId: string | null = null
  userSelectedPreference: any[] = []
  isOpen: boolean = false;
  searchValue: string = "";

  selectedFilters: any[] = [];
  priceFilters: any =
    {
      type: 'price',
      data: [' ₹0 - 200', ' ₹201 - ₹400', ' ₹401 - ₹600']
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
    this.selectedFilters.forEach((filter: any) => {
      switch (filter.type) {
        case 'price': {
          this.filteredVenueShowsDetails = this.venueShowsDetails.filter((venue: any) => {
            return venue.screens.some((screen: any) => {
              return screen.showTimes.some((showTime: any) => {
                return showTime.availableCategories.some((category: any) => {
                  return Number(category.categoryPrice) <= Number(filter.value.split('-')[1]);
                });
              });
            });
          });
          break;
        }
        case 'preferedTime': {
          this.filteredVenueShowsDetails = this.venueShowsDetails.filter((venue: any) => {
            return venue.screens.some((screen: any) => {
              return screen.showTimes.some((showTime: any) => {
                return (showTime.time >= (filter.value.split(',')[1]).split('-')[0]) && (showTime.time <= (filter.value.split(',')[1]).split('-')[1])
              });
            });
          });
          break;
        }
      }
    })
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
        show.availableCategories.forEach((timeSlot: any) => {
          const time = show.time;
          if (!screen!.showTimesMap.has(time)) {
            screen!.showTimesMap.set(time, { showIds: new Set(), categoryMap: new Map() });
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
    const venues: any[] = Array.from(venueMap.values()).map((venue) => ({
      ...venue,
      screens: venue.screens.map((screen) => ({
        screenId: screen.screenId,
        showTimes: Array.from(screen.showTimesMap.entries()).map(
          ([time, slot]: [string, ShowMapSlot]): TimeSlot => ({
            time,
            showIds: Array.from(slot.showIds),
            availableCategories: Array.from(slot.categoryMap.values()),
          })
        ),
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
    if (index < 3) {
      this.commonService.setUserSelectedDate(dateObj);
      this.fetchVenuesShows(this.contentId);
    }
    return
  }

  /**
* @description sets user seleced venue screen and show time and then navigate to seat layout page
* @author Inzamam
* @params payload:venue, screen, showTim
*/
  navigateToSeatLayout(venue: Venue, screen: Screen, showTime: TimeSlot) {
    this.commonService.setUserSelectedShow({ ...showTime, screenId: screen.screenId });
    let showData = venue.screens.map((screen: any) => ({
      screenId: screen.screenId,
      screenName: screen.screenName,
      shows: screen.showTimes.map((showTime: any) => ({
        showId: showTime.showIds[0],
        time: showTime.time,
        availableCategories: showTime.availableCategories,
      }))
    }));

    let screenShows = this.venueShowsDetails[0]?.screens
    this.router.navigate([`/movies/city-${this.commonService._selectCity()?.toLowerCase()}/seat-layout/eventId-${this.movieDetails?.eventId}/venueId-${venue.venueId}/screenId-${screen.screenId}/showId-${this.commonService.userSelectedShow()?.showIds[0]}/date-${this.commonService.userSelectedDate()?.today}`], { state: { showData: showData, screenShows: screenShows } });
  }

  /**
* @description function that initializes dateSelectionArray
* @author Inzamam
* @params payload:event,path
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