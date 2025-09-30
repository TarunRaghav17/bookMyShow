import { Component } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { ActivitiesService } from '../service/activities.service';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'app-activities-page',
  standalone: false,
  templateUrl: './activities-page.component.html',
  styleUrl: './activities-page.component.scss'
})
export class ActivitiesPageComponent {
  dummyMoviesdata: any[] = []
  filters: any[] = []
  topFiltersArray!: any[]
  filtersArray: any[] = []
  page: number = 0
  size: number = 8
  totalCount: number = 0
  shouldCallAPI: boolean = false
  sendPayload: any = {
    "type": "string",
    "categories": [],
    "price": [],
    "morefilter": [],
    "dateFilters": []
  }
  constructor(public commonService: CommonService, private activitiesService: ActivitiesService, private toastr: ToastrService, public loaderService: LoaderService) {
    this.commonService._selectedCategory.set('Activities');
  }
  /**
 * @description initialize Top Filters
 * @author Manu Shukla
 * @returnType void
 */

  ngOnInit(): void {
    this.setFilter()
    this.sendPayload.type = 'Activities'
    this.getAllActivities()
  }
  /**
* @description Remove Already Selected Filters along with selected Category
* @author Manu Shukla
*/
  ngOnDestroy(): void {
    this.commonService.resetSelectedFiltersSignal()
  }

  /**
* @description Set All Filters by using ForkJoin 
* @author Manu Shukla
*/
  setFilter() {
    forkJoin([
      this.activitiesService.getFilters('date_filters'),
      this.activitiesService.getFilters('categories'),
      this.activitiesService.getFilters('more_filters'),
      this.activitiesService.getFilters('prices')
    ]).subscribe({
      next: ([date_filters, categories, more_filters, prices]) => {
        let filters = [{ type: 'Date', data: date_filters.data }, { type: 'Categories', data: categories.data }, { type: 'More Filters', data: more_filters.data }, { type: 'Price', data: prices.data }];
        this.commonService.setFiltersSignal(filters)
      },
      error: (err) => {
        this.toastr.error(err.message);
      }
    })
  }

  /**
  * @description Display All Activities Cards
  * @author Manu Shukla
  */
  getAllActivities() {
    this.activitiesService.getAllActivities(this.sendPayload, this.page, this.size).subscribe({
      next: (res) => {
        this.totalCount = res.data.count;
        let resData = res.data.content;
        this.dummyMoviesdata.push(...resData);
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

      case 'Categories':
        this.toggleId(this.sendPayload.categories, event.filterName.categoryId); break;

      case 'More Filters':
        this.toggleId(this.sendPayload.morefilter, event.filterName.moreFilterId);
        break;

      case 'Price':
        this.toggleId(this.sendPayload.price, event.filterName.priceId);
        break;
    }
    this.page = 0;
    this.dummyMoviesdata = [];
    this.getAllActivities()
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
        } else {
          this.shouldCallAPI = false
        }
        break;

      case 'Categories':
        if (this.sendPayload.categories.length > 0) {
          this.sendPayload.categories = [];
          this.commonService.clearSelectedFilterByType('Categories');
          this.shouldCallAPI = true
        } else {
          this.shouldCallAPI = false
        }
        break;

      case 'More Filters':
        if (this.sendPayload.more_filters.length > 0) {
          this.sendPayload.morefilter = [];
          this.commonService.clearSelectedFilterByType('More Filters');
          this.shouldCallAPI = true
        } else {
          this.shouldCallAPI = false
        }
        break;

      case 'Price':
        if (this.sendPayload.price.length > 0) {
          this.sendPayload.price = [];
          this.commonService.clearSelectedFilterByType('Price');
          this.shouldCallAPI = true
        } else {
          this.shouldCallAPI = false
        }
        break;

      default:
        break;
    }
    if (this.shouldCallAPI) {
      this.page = 0;
      this.dummyMoviesdata = [];
      this.getAllActivities();
    }
  }
  
  /**
* @description Pagination - Load More Activities Cards on Scroll
* @author Manu Shukla
*/
  onScroll(event: any) {
    const element = event.target as HTMLElement;
    if (element.scrollHeight - element.scrollTop <= element.clientHeight && this.dummyMoviesdata.length < this.totalCount) {
      this.page++
      this.getAllActivities()
    }
  }

/**
* @description If there is no data in selected filter then reset the all filter 
* @author Manu Shukla
*/ 
 resetFilter() {
    this.commonService.selectedFiltersSignal().map((item: any) => {
      item.data.map((i: any) => {
        i.selected = false
      })
    }
    )
    this.commonService.resetSelectedFiltersSignal()
    this.sendPayload = {
        "type": "Activities",
        "categories": [],
        "price": [],
        "morefilter": [],
        "dateFilters": []
      }
      this.getAllActivities()
  }
}





