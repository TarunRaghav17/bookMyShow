import { Component } from '@angular/core';
import { movies, selectedFilters } from '../../../../../../db';
import { CommonService } from '../../../../services/common.service';
import { ActivitiesService } from '../service/activities.service';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-activities-page',
  standalone: false,
  templateUrl: './activities-page.component.html',
  styleUrl: './activities-page.component.scss'
})
export class ActivitiesPageComponent {
  dummyMoviesdata: any[] | null = null;
  originalMovies = movies
  filters: any[] = []
  select: any[] = selectedFilters
  topFiltersArray!: any[]
  filtersArray: any[] = []
  sendPayload: any = {
    "type": "string",
    "categories": [],
    "price": [],
    "morefilter": [],
    "dateFilters": []
  }
  constructor(public commonService: CommonService, private activitiesService: ActivitiesService, private toastr: ToastrService) {
    this.commonService._selectedCategory.set('Activities');
  }
  /**
 * @description initialize Top Filters
 * @author Manu Shukla
 * @params  
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
* @params  
* @returnType void
*/
  ngOnDestroy(): void {
    this.commonService.resetfilterAccordian(this.commonService.filtersSignal())
  }

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
  getAllActivities() {
    this.activitiesService.getAllActivities(this.sendPayload).subscribe({
      next: (res) => {
        this.dummyMoviesdata = res.data || []
      },
      error: (err) => {
        this.toastr.error(err.message);
      }
    })
  }

  toggleId(array: any[], id: any): void {
    const index = array.indexOf(id);
    if (index > -1) {
      array.splice(index, 1);
    } else {
      array.push(id);
    }
  }

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

      case 'Prices':
        this.toggleId(this.sendPayload.price, event.filterName.priceId);
        break;
    }
    this.getAllActivities()
    this.commonService.handleEventFilter(event)
  }
  clearFilter(item: any) {
      if (!item) return;
    switch (item) {
       case 'Date':
       this.sendPayload.dateFilters = [];
       break;
       case 'Categories':
        this.sendPayload.categories = []; 
       break;
       case ' More Filters':
        this.sendPayload.morefilter = [];
       break;
       case 'Prices':
        this.sendPayload.price = [];
       break;
    }
    this.getAllActivities()
  }

}
