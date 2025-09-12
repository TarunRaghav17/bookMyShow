import { Component } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { filters, movies, selectedFilters, topFilters } from '../../../../../../db';
import { PlaysService } from '../plays.service';

@Component({
  selector: 'app-plays-landing-page',
  standalone: false,
  templateUrl: './plays-landing-page.component.html',
  styleUrl: './plays-landing-page.component.scss'
})
export class PlaysLandingPageComponent {
  dummyMoviesdata: any[] = [];
  topFiltersArray: any[] = topFilters
  originalMovies = movies
  filters: any[] = filters
  select: any[] = selectedFilters

  constructor(public commonService: CommonService , 
    private playService:PlaysService
  ) {
    // this.dummyMoviesdata = movies;
    this.commonService._selectedCategory.set('Plays');
  }

  /**
   * @description initialize Top Filters
   * @author Manu Shukla
   * @params  
   * @returnType void
   */

  ngOnInit(): void {
    // this.topFiltersArray = this.commonService.getTopFiltersArray(filters)
    this.playService.getAllPlays().subscribe((res)=>{
      this.dummyMoviesdata = res.data
   
    }
    )

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
