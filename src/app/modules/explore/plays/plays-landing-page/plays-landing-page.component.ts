import { Component } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { movies, selectedFilters } from '../../../../../../db';
import { PlaysService } from '../service/plays.service';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-plays-landing-page',
  standalone: false,
  templateUrl: './plays-landing-page.component.html',
  styleUrl: './plays-landing-page.component.scss'
})
export class PlaysLandingPageComponent {
  dummyMoviesdata: any[] = [];
  topFiltersArray!: any[]
  originalMovies = movies
  filters: any[] = []
  select: any[] = selectedFilters
  filtersArray: any[] = []
  sendPayload: any = {
    "type": "string",
    "dateFilters": [],
    "languages": [],
    "genres": [],
    "categories": [],
    "morefilter": [],
    "price": [],
  }

  constructor(public commonService: CommonService, private playService: PlaysService, private toastr: ToastrService) {
    this.commonService._selectedCategory.set('Plays');
  }

  /**
   * @description initialize Top Filters
   * @author Manu Shukla
   * @params  
   * @returnType void
   */

  ngOnInit(): void {
    this.setFilter()
    this.sendPayload.type = 'Plays'
    this.playService.getAllPlays(this.sendPayload).subscribe({
      next: (res) => {
        this.dummyMoviesdata = res.data
      },
      error: (err) => {
        this.toastr.error(err.message);
      }
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
    this.commonService.resetfilterAccordian(this.commonService.filtersSignal())
  }
  setFilter() {
    forkJoin([
      this.playService.getFilters('date_filters'),
      this.playService.getFilters('languages'),
      this.playService.getFilters('genres'),
      this.playService.getFilters('categories'),
      this.playService.getFilters('more_filters'),
      this.playService.getFilters('prices')
    ]).subscribe({
      next: ([date_filters, languages, genres, categories, more_filters, prices]) => {
        let filters = [{ type: 'Date', data: date_filters.data }, { type: 'Language', data: languages.data }, { type: 'Genres', data: genres.data }, { type: 'Categories', data: categories.data }, { type: 'More Filters', data: more_filters.data }, { type: 'Price', data: prices.data }];
        this.commonService.setFiltersSignal(filters)
      },
      error: (err) => {
        this.toastr.error(err.message);
      }
    });
  }
  getFilter(event: any) {
    switch (event.type) {
      case 'Date':
        this.sendPayload.dateFilter.push(event.filterName.dateFilterId);
        break;

      case 'Language':
        this.sendPayload.languageFilters.push(event.filterName.languageId);
        break;

      case 'Genres':
        this.sendPayload.genres.push(event.filterName.genresId);
        break;

      case 'Categories':
        this.sendPayload.categories.push(event.filterName.categoryId);
        break;

      case 'More Filters':
        this.sendPayload.morefilter.push(event.filterName.morefilterId);
        break;

      case 'Prices':
        this.sendPayload.categories.push(event.filterName.priceId);
        break;
    }
    // console.log(this.sendPayload);
    this.playService.getAllPlays(this.sendPayload).subscribe({
      next: (res) => {
        this.dummyMoviesdata = res.data
      },
      error: (err) => {
        this.toastr.error(err.message);
      }
    })
    this.commonService.handleEventFilter(event)
  }
}
