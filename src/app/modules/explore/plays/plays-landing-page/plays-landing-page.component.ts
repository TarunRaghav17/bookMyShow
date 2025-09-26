import { Component } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { PlaysService } from '../service/plays.service';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-plays-landing-page',
  standalone: false,
  templateUrl: './plays-landing-page.component.html',
  styleUrl: './plays-landing-page.component.scss'
})
export class PlaysLandingPageComponent {
  dummyMoviesdata: any[] = []
  topFiltersArray!: any[]
  filters: any[] = []
  filtersArray: any[] = []
  page: number = 0
  size: number = 8
  totalCount: number = 0
  sendPayload: any = {
    "type": "string",
    "dateFilters": [],
    "languages": [],
    "genres": [],
    "categories": [],
    "morefilter": [],
    "price": [],
  }

  constructor(public commonService: CommonService, private playService: PlaysService, private toastr: ToastrService) {
    this.commonService._selectedCategory.set('Plays');
  }

  /**
   * @description initialize Top Filters
   * @author Manu Shukla
   * @params  
   * @returnType void
   */

  ngOnInit(): void {
    this.setFilter()
    this.sendPayload.type = 'Plays'
    this.getAllPlays()
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
* @description Display All Plays Cards
* @author Manu Shukla
*/
  getAllPlays() {
    this.playService.getAllPlays(this.sendPayload, this.page, this.size).subscribe({
      next: (res) => {
        this.totalCount = res.data.count
        let resData = res.data.content
        this.dummyMoviesdata.push(...resData)
      },
      error: (err) => {
        this.toastr.error(err.message);
      }
    }
    )
  }

/**
* @description Set All Filters by using ForkJoin 
* @author Manu Shukla
*/
  setFilter() {
    forkJoin([
      this.playService.getFilters('date_filters'),
      this.playService.getFilters('languages'),
      this.playService.getFilters('genres'),
      this.playService.getFilters('categories'),
      this.playService.getFilters('more_filters'),
      this.playService.getFilters('prices')
    ]).subscribe({
      next: ([date_filters, languages, genres, categories, more_filters, prices]) => {
        let filters = [{ type: 'Date', data: date_filters.data }, { type: 'Language', data: languages.data }, { type: 'Genres', data: genres.data }, { type: 'Categories', data: categories.data }, { type: 'More Filters', data: more_filters.data }, { type: 'Price', data: prices.data }];
        this.commonService.setFiltersSignal(filters)
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

      case 'Genres':
        this.toggleId(this.sendPayload.genres, event.filterName.genresId);
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
    this.page = 0;
    this.dummyMoviesdata = [];
    this.getAllPlays()
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
        this.sendPayload.dateFilters = []
        break;

      case 'Language':
        this.sendPayload.languages = []
        break;

      case 'Genres':
        this.sendPayload.genres = []
        break;

      case 'Categories':
        this.sendPayload.categories = []
        break;

      case 'More Filters':
        this.sendPayload.morefilter = []
        break;

      case 'Prices':
        this.sendPayload.price = []
        break;

    }
    this.page = 0;
    this.dummyMoviesdata = [];
    this.getAllPlays()
  }
  
    /**
* @description Pagination - Load More Activities Cards on Scroll
* @author Manu Shukla
*/
  onScroll(event: any) {
    const element = event.target;
    if (element.scrollHeight - element.scrollTop <= element.clientHeight && this.dummyMoviesdata.length < this.totalCount) {
      this.page++;
      this.getAllPlays();
    }
  }
}
