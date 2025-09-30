import { Component } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { SportsService } from '../service/sports.service';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../services/loader.service';
@Component({
  selector: 'app-sports-page',
  standalone: false,
  templateUrl: './sports-page.component.html',
  styleUrl: './sports-page.component.scss'
})
export class SportsPageComponent {
  dummyMoviesdata: any[] = []
  filters: any[] = []
  page: number = 0
  size: number = 8
  totalCount: number = 0
  shouldCallAPI: boolean = false
  sendPayload: any = {
    "type": "string",
    "dateFilters": [],
    "categories": [],
    "morefilter": [],
    "prices": [],
  }

  constructor(public commonService: CommonService, private sportService: SportsService, private toastr: ToastrService, public loaderService: LoaderService) {
    this.commonService._selectedCategory.set('Sports');
  }
  /**
 * @description initialize Top Filters
 * @author Manu Shukla
 * @params  
 * @returnType void
 */

  ngOnInit(): void {
    this.setFilter()
    this.sendPayload.type = 'Sports'
    this.getAllSports()
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
* @description Display All Sports Cards
* @author Manu Shukla
*/

  getAllSports() {
    this.sportService.getAllSports(this.sendPayload, this.page, this.size).subscribe({
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
      this.sportService.getFilters('date_filters'),
      this.sportService.getFilters('categories'),
      this.sportService.getFilters('more_filters'),
      this.sportService.getFilters('prices')
    ]).subscribe({
      next: ([date_filters, categories, more_filters, prices]) => {
        let filters = [{ type: 'Date', data: date_filters.data }, { type: 'Categories', data: categories.data }, { type: 'More Filters', data: more_filters.data }, { type: 'Price', data: prices.data }]
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
    this.getAllSports()
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
        if (this.sendPayload.morefilter.length > 0) {
          this.sendPayload.morefilter = [];
          this.commonService.clearSelectedFilterByType('More Filters');
          this.shouldCallAPI = true
        }
        else {
          this.shouldCallAPI = false
        }
        break;

      case 'Price':
        if (this.sendPayload.price.length > 0) {
          this.sendPayload.price = [];
          this.commonService.clearSelectedFilterByType('Price');
        }
        else {
          this.shouldCallAPI = false
        }
        break;

      default:
        break;
    }
    if (this.shouldCallAPI) {
      this.page = 0;
      this.dummyMoviesdata = [];
      this.getAllSports();
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
      this.getAllSports()
    }
  }
  resetFilter() {
    this.commonService.selectedFiltersSignal().map((item: any) => {
      item.data.map((i: any) => {
        i.selected = false
      })
    }
    )
    this.commonService.resetSelectedFiltersSignal()
    this.sendPayload = {
      "type": "Sports",
      "dateFilters": [],
      "categories": [],
      "morefilter": [],
      "prices": [],
    }
    this.getAllSports()
  }
}
