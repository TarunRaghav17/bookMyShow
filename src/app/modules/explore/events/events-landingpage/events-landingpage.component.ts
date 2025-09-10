import { Component } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { filters, movies, selectedFilters, topFilters } from '../../../../../../db';

@Component({
  selector: 'app-events-landingpage',
  standalone: false,
  templateUrl: './events-landingpage.component.html',
  styleUrl: './events-landingpage.component.scss'
})
export class EventsLandingPageComponent {
  dummyMoviesdata: any[] = [];
  topFiltersArray: any[] = topFilters
  filters: any[] = filters
  select: any[] = selectedFilters
  originalMovies = movies;

  constructor(public commonService: CommonService) {
    this.dummyMoviesdata = movies;
    this.commonService._selectedCategory.set('Events');
  }

  /**
   * @description initialize Top Filters
   * @author Manu Shukla
   * @params  
   * @returnType void
   */

  ngOnInit(): void {
    this.topFiltersArray = this.commonService.getTopFiltersArray(filters)
  }

  /**
* @description Remove Already Selected Filters
* @author Manu Shukla
* @params  
* @returnType void
*/

  ngOnDestroy(): void {
    this.commonService.resetfilterAccordian(this.filters)
  }

}
