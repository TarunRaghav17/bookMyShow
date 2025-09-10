import { Component } from '@angular/core';
import { filters, movies, selectedFilters, topFilters } from '../../../../../../db';
import { CommonService } from '../../../../services/common.service';
@Component({
  selector: 'app-sports-page',
  standalone: false,
  templateUrl: './sports-page.component.html',
  styleUrl: './sports-page.component.scss'
})
export class SportsPageComponent {
  dummyMoviesdata: any[] = [];
  topFiltersArray: any[] = topFilters
  originalMovies = movies
  filters: any[] = filters
  select: any[] = selectedFilters

  constructor(public commonService: CommonService) {
    this.dummyMoviesdata = movies;
    this.commonService._selectedCategory.set('Sports');
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
* @description Remove Already Selected Filters
* @author Manu Shukla
* @params  
* @returnType void
*/

  ngOnDestroy(): void {
    this.commonService.resetfilterAccordian(this.filters)
    localStorage.removeItem('category')
  }

}
