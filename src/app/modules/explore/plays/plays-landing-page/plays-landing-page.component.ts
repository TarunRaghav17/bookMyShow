import { Component } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { movies, selectedFilters, topFilters } from '../../../../../../db';
import { PlaysService } from '../plays.service';
import { forkJoin } from 'rxjs';

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
  filters: any[] = []
  select: any[] = selectedFilters
  filtersArray:any[]=[]

  constructor(public commonService: CommonService , 
    private playService:PlaysService
  ) {
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
    this.setFilter()
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


   setFilter() {
      forkJoin([
        this.playService.getFilters('date_filters'),
        this.playService.getFilters('languages'),
        this.playService.getFilters('genres'),
        this.playService.getFilters('categories'),
        this.playService.getFilters('more_filters'),
        this.playService.getFilters('prices')
      ]).subscribe(([date_filters, languages,  genres,categories, more_filters,prices]) => {
        this.filters = [{type:'Date',data: date_filters.data}, {type:'Language',data:languages.data} , {type:'Categories', data:categories.data},{type:'Genres', data:genres.data}, {type:'More Filters', data:more_filters.data},{type:'Price', data:prices.data}];
      });
    }
}
