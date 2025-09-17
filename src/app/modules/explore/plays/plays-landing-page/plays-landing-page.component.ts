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
    this.playService.getAllPlays().subscribe({
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
}
