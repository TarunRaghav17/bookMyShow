import { Component, OnDestroy } from '@angular/core';
import { filters, movies, selectedFilters, topFilters } from '../../../../../../db';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie',
  standalone: false,
  templateUrl: './movies-landingpage.component.html',
  styleUrl: './movies-landingpage.component.scss'
})
export class MovieLandingPageComponent implements OnDestroy {
  dummyMoviesdata: any[] = [];
  selectedCity: any = null
  topFiltersArray: any[] = topFilters
  originalMovies = movies;
  filters: any[] = filters
  select: any[] = selectedFilters

  constructor(public commonService: CommonService, public router: Router) {
    this.dummyMoviesdata = movies;
    this.selectedCity = this.commonService._selectCity()
    this.commonService._selectedCategory.set('Movies');
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
