import { Component } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { movies, selectedFilters } from '../../../../../../db';
import { EventService } from '../service/event.service';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

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

  constructor(public commonService: CommonService, private eventService: EventService, private toastr: ToastrService) {
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
    this.eventService.getFilters('categories').subscribe({
      next: (res) => {
        this.topFiltersArray = res.data
      },
      error: (res) => {
        this.toastr.error(res.error);
      }
    })
    this.eventService.getAllEvents().subscribe({
      next: (res) => {
        this.dummyMoviesdata = res.data
      },
      error: (res) => {
        this.toastr.error(res.error);
      }
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
    ]).subscribe({
      next: ([date_filters, languages, categories, more_filters, prices]) => {
        this.filters = [{ type: 'Date', data: date_filters.data }, { type: 'Language', data: languages.data }, { type: 'Categories', data: categories.data }, { type: 'More Filters', data: more_filters.data }, { type: 'Price', data: prices.data }];
      },
      error: (res) => {
        this.toastr.error(res.error);
      }
    });

  }
}
