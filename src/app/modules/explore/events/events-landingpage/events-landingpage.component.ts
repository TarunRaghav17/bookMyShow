import { Component } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { movies, selectedFilters } from '../../../../../../db';
import { EventService } from '../service/event.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-events-landingpage',
  standalone: false,
  templateUrl: './events-landingpage.component.html',
  styleUrl: './events-landingpage.component.scss'
})
export class EventsLandingPageComponent {
  dummyMoviesdata: any[] = [];
  topFiltersArray!: any[]
  filters!: any[] 
  select: any[] = selectedFilters
  originalMovies = movies;
  filtersArray: any[] = [];

  constructor(public commonService: CommonService,private eventService:EventService ) {
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
    this.setFilter()
    this.eventService.getFilters('categories').subscribe((res)=>{
    this.topFiltersArray = res.data
    })
    this.eventService.getAllEvents().subscribe((res)=>{
    this.dummyMoviesdata = res.data
    })
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
        this.eventService.getFilters('date_filters'),
        this.eventService.getFilters('languages'),
        this.eventService.getFilters('categories'),
        this.eventService.getFilters('more_filters'),
        this.eventService.getFilters('prices')
      ]).subscribe(([date_filters, languages,categories, more_filters,prices]) => {
        this.filters = [{type:'Date',data: date_filters.data}, {type:'Language',data:languages.data} , {type:'Categories', data:categories.data}, {type:'More Filters', data:more_filters.data},{type:'Price', data:prices.data}];
      });
    }
}
