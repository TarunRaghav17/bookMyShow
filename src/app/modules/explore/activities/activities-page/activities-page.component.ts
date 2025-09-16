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
    this.activitiesService.getFilters('categories').subscribe({
      next: (res) => {
        this.topFiltersArray = res.data
        
      },
      error: (res) => {
        this.toastr.error(res.message);
         
      }
    })
    this.activitiesService.getAllActivities().subscribe({
      next: (res) => {
        this.dummyMoviesdata = res.data
      },
      error:() => {
        this.toastr.error("Failed To Fetch Activities");
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
    this.commonService.resetfilterAccordian(this.filters)
  }

  setFilter() {
    forkJoin([
      this.activitiesService.getFilters('date_filters'),
      this.activitiesService.getFilters('categories'),
      this.activitiesService.getFilters('more_filters'),
      this.activitiesService.getFilters('prices')
    ]).subscribe({
      next: ([date_filters, categories, more_filters, prices]) => {
        this.filters = [{ type: 'Date', data: date_filters.data }, { type: 'Categories', data: categories.data }, { type: 'More Filters', data: more_filters.data }, { type: 'Price', data: prices.data }];
      },
      error: (res) => {
        this.toastr.error(res.message);
      }
    })
  }
}
