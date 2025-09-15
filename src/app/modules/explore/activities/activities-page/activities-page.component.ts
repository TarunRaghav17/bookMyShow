import { Component } from '@angular/core';
import {  movies, selectedFilters, topFilters } from '../../../../../../db';
import { CommonService } from '../../../../services/common.service';
import { ActivitiesService } from '../activities.service';
import { forkJoin } from 'rxjs';

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
  topFiltersArray: any[] = topFilters
  filtersArray:any[]=[]

  constructor(public commonService: CommonService , private activitiesSercice:ActivitiesService) {
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
      this.activitiesSercice.getAllActivities().subscribe((res)=>{
      this.dummyMoviesdata = res.data
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
      this.activitiesSercice.getFilters('date_filters'),
      this.activitiesSercice.getFilters('categories'),
      this.activitiesSercice.getFilters('more_filters'),
      this.activitiesSercice.getFilters('prices')
    ]).subscribe(([date_filters, categories, more_filters,prices]) => {
      this.filters = [{type:'Date',data: date_filters.data}, {type:'Categories', data:categories.data}, {type:'More Filters', data:more_filters.data},{type:'Price', data:prices.data}];
    });
  }

}
