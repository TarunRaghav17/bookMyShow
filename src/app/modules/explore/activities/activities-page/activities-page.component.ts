import { Component } from '@angular/core';
import { filters, movies, selectedFilters, topFilters } from '../../../../../../db';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-activities-page',
  standalone: false,
  templateUrl: './activities-page.component.html',
  styleUrl: './activities-page.component.scss'
})
export class ActivitiesPageComponent {
  dummyMoviesdata: any[] = [];
  originalMovies = movies
  filters: any[] = filters
  select: any[] = selectedFilters
  topFiltersArray: any[] = topFilters

  constructor(public commonService: CommonService) {
    this.dummyMoviesdata = movies;
    this.commonService._selectedCategory.set('Activities');
  }
  /**
 * @description initialize Top Filters
 * @author Manu Shukla
 * @params  
 * @returnType void
 */

  ngOnInit(): void {
    // this.topFiltersArray = this.commonService.getTopFiltersArray(filters)
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

}
