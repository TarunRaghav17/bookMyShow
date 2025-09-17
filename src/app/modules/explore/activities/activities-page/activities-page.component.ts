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
  dummyMoviesdata: any[] = [];
  originalMovies = movies
  filters: any[] = []
  select: any[] = selectedFilters
  topFiltersArray!: any[]
  filtersArray: any[] = []
  sendPayload: any = {
    "type": "string",
    "languages": [],
    "genres": [],
    "formats": [],
    "tags": [],
    "categories": [],
    "price": [],
    "morefilter": [],
    "releaseMonths": [],
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
    this.activitiesService.getAllActivities(this.sendPayload).subscribe({
      next: (res) => {
        this.dummyMoviesdata = res.data
      },
      error: (err) => {
        this.toastr.error(err.message);
      }
    })
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
  getFilter(event: any) {
    console.log(event);
    if (event.type == 'Date') {
      this.sendPayload.dateFilters.push(event.filterName.dateFilterId)
    } else if (event.type == "Categories"){
      this.sendPayload.categories.push(event.filterName.categoryId)
    }
    else if(event.type == "More Filters"){
this.sendPayload.categories.push(event.filterName.morefilterId)
    }
console.log(this.sendPayload);
      
    this.activitiesService.getAllActivities(this.sendPayload).subscribe({
      next: (res) => {
        this.dummyMoviesdata = res.data
      },
      error: (err) => {
        this.toastr.error(err.message);
      }
    })
    this.commonService.handleEventFilter(event)
  }
}
