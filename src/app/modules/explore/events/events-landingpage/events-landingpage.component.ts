import { Component } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { EventService } from '../service/event.service';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'app-events-landingpage',
  standalone: false,
  templateUrl: './events-landingpage.component.html',
  styleUrl: './events-landingpage.component.scss'
})
export class EventsLandingPageComponent {
  dummyMoviesdata: any[] = []
  topFiltersArray!: any[]
  filters!: any[]
  filtersArray: any[] = [];
  page: number = 0
  size: number = 8
  totalCount: number = 0
  shouldCallAPI: boolean = false
  sendPayload: any = {
    "type": "string",
    "dateFilters": [],
    "languages": [],
    "categories": [],
    "morefilter": [],
    "price": [],
  }

  constructor(public commonService: CommonService, private eventService: EventService, private toastr: ToastrService, public loaderService: LoaderService) {
    this.commonService._selectedCategory.set('Events');
  }

  /**
   * @description initialize Top Filters
   * @author Manu Shukla
   * @params  
   * @returnType void
   */

  ngOnInit(): void {
    this.setFilter()
    this.sendPayload.type = 'Event'
    this.getAllEvents()

  }
  /**
* @description Remove Already Selected Filters
* @author Manu Shukla
* @params  
* @returnType void
*/

  ngOnDestroy(): void {
    this.commonService.resetSelectedFiltersSignal()
  }

  /**
  * @description Display All Events Cards
  * @author Manu Shukla
  */
  getAllEvents() {
    this.eventService.getAllEvents(this.sendPayload, this.page, this.size).subscribe({
      next: (res) => {
        this.totalCount = res.data.count
        let resData = res.data.content
        this.dummyMoviesdata.push(...resData)
      },
      error: (err) => {
        this.toastr.error(err.message);
      }
    })
  }

  /**
* @description Set All Filters by using ForkJoin 
* @author Manu Shukla
*/
  setFilter() {
    forkJoin([
      this.eventService.getFilters('date_filters'),
      this.eventService.getFilters('languages'),
      this.eventService.getFilters('categories'),
      this.eventService.getFilters('more_filters'),
      this.eventService.getFilters('prices')
    ]).subscribe({
      next: ([date_filters, languages, categories, more_filters, prices]) => {
        this.filters = [{ type: 'Date', data: date_filters.data }, { type: 'Language', data: languages.data }, { type: 'Categories', data: categories.data }, { type: 'More Filters', data: more_filters.data }, { type: 'Price', data: prices.data }];
        this.commonService.setFiltersSignal(this.filters)
      },
      error: (err) => {
        this.toastr.error(err.message);
      }
    });
  }

  toggleId(array: any[], id: any): void {
    const index = array.indexOf(id);
    if (index > -1) {
      array.splice(index, 1);
    } else {
      array.push(id);
    }
  }

  /**
  * @description Get Selected Filters cards by sending the Payload
  * @author Manu Shukla
  * @param  {event} - Object containing filter type and corresponding filter ID
   */
  getFilter(event: any) {
    switch (event.type) {
      case 'Date':
        this.toggleId(this.sendPayload.dateFilters, event.filterName.dateFilterId);
        break;

      case 'Language':
        this.toggleId(this.sendPayload.languages, event.filterName.languageId);
        break;

      case 'Categories':
        this.toggleId(this.sendPayload.categories, event.filterName.categoryId);
        break;

      case 'More Filters':
        this.toggleId(this.sendPayload.morefilter, event.filterName.moreFilterId);
        break;

      case 'Price':
        this.toggleId(this.sendPayload.price, event.filterName.priceId);
        break;
    }
    this.page = 0;
    this.dummyMoviesdata = [];
    this.getAllEvents()
    this.commonService.handleEventFilter(event)
  }

  /**
* @description Remove Selected Filters by empty the payload array
* @author Manu Shukla
* @param  {item} - Filter Type (Date, Categories, More Filters, Prices)
*/
  clearFilter(item: any) {
    if (!item) return;
    switch (item) {
      case 'Date':
        if (this.sendPayload.dateFilters.length > 0) {
          this.sendPayload.dateFilters = [];
          this.commonService.clearSelectedFilterByType('Date');
          this.shouldCallAPI = true
        }
        else {
          this.shouldCallAPI = false
        }
        break;

      case 'Language':
        if (this.sendPayload.languages.length > 0) {
          this.sendPayload.languages = [];
          this.commonService.clearSelectedFilterByType('Language');
          this.shouldCallAPI = true
        }
        else {
          this.shouldCallAPI = false
        }
        break;

      case 'Categories':
        if (this.sendPayload.categories.length > 0) {
          this.sendPayload.categories = [];
          this.commonService.clearSelectedFilterByType('Categories');
          this.shouldCallAPI = true
        }
        else {
          this.shouldCallAPI = false
        }
        break;

      case 'More Filters':
        if (this.sendPayload.categories.length > 0) {
          this.sendPayload.morefilter = [];
          this.commonService.clearSelectedFilterByType('More Filters');
          this.shouldCallAPI = true
        }
        else {
          this.shouldCallAPI = false
        }
        break;

      case 'Price':
        if(this.sendPayload.price.length > 0){
          this.sendPayload.price = [];
          this.commonService.clearSelectedFilterByType('Price');
          this.shouldCallAPI = true
        }
         else {
          this.shouldCallAPI = false
        }
        break;

      default:
      break;
    }
    if(this.shouldCallAPI){
      this.page = 0;
      this.dummyMoviesdata = [];
      this.getAllEvents();
    }
  }

  /**
* @description Pagination - Load More Activities Cards on Scroll
* @author Manu Shukla
*/
  onScroll(event: any) {
    const element = event.target;
    if (element.scrollHeight - element.scrollTop <= element.clientHeight && this.dummyMoviesdata.length < this.totalCount) {
      this.page++;
      this.getAllEvents();
    }
  }
}