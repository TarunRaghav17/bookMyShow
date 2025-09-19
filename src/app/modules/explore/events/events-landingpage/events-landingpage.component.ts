import { Component } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { movies, selectedFilters } from '../../../../../../db';
import { EventService } from '../service/event.service';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-events-landingpage',
  standalone: false,
  templateUrl: './events-landingpage.component.html',
  styleUrl: './events-landingpage.component.scss'
})
export class EventsLandingPageComponent {
  dummyMoviesdata: any[]|null = null;
  topFiltersArray!: any[]
  filters!: any[]
  select: any[] = selectedFilters
  originalMovies = movies;
  filtersArray: any[] = [];
  sendPayload: any = {
    "type": "string",
    "dateFilters": [],
    "languages": [],
    "categories": [],
    "morefilter": [],
    "price": [],
  }

  constructor(public commonService: CommonService, private eventService: EventService, private toastr: ToastrService) {
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
    this.eventService.getAllEvents(this.sendPayload).subscribe({
      next: (res) => {
        this.dummyMoviesdata = res.data || []
      },
      error: (err) => {
        this.toastr.error(err.message);
      }
    })
  }
  /**
* @description Remove Already Selected Filters
* @author Manu Shukla
* @params  
* @returnType void
*/

  ngOnDestroy(): void {
    this.commonService.resetfilterAccordian(this.commonService.filtersSignal())
  }

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

getFilter(event: any){
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

    case 'Prices':
      this.toggleId(this.sendPayload.price, event.filterName.priceId);
      break;
  } 
  
  this.eventService.getAllEvents(this.sendPayload).subscribe({
    next: (res) => {
      this.dummyMoviesdata = res.data;
    },
    error: (err) => {
      this.toastr.error(err.message);
    }
  });
  this.commonService.handleEventFilter(event);
}

getImageFromBase64(){

}

}
