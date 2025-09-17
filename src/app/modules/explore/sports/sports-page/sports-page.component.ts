import { Component } from '@angular/core';
import { movies, selectedFilters, topFilters } from '../../../../../../db';
import { CommonService } from '../../../../services/common.service';
import { SportsService } from '../service/sports.service';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
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
  filters: any[] = []
  select: any[] = selectedFilters

  constructor(public commonService: CommonService, private sportService: SportsService, private toastr: ToastrService) {
    this.commonService._selectedCategory.set('Sports');
  }
  /**
 * @description initialize Top Filters
 * @author Manu Shukla
 * @params  
 * @returnType void
 */

  ngOnInit(): void {
    this.setFilter()
    this.sportService.getFilters('categories').subscribe({
      next: (res) => {
        this.topFiltersArray = res.data
      },
      error: (res) => {
        this.toastr.error(res.message);
      }
    })

    this.sportService.getAllSports().subscribe({
      next: (res) => {
        this.dummyMoviesdata = res.data
      },
      error: () => {
        this.toastr.error("Failed To Fetch Sports");
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
    localStorage.removeItem('category')
  }

  setFilter() {
    forkJoin([
      this.sportService.getFilters('date_filters'),
      this.sportService.getFilters('categories'),
      this.sportService.getFilters('more_filters'),
      this.sportService.getFilters('prices')
    ]).subscribe({
      next: ([date_filters, categories, more_filters, prices]) => {
        this.filters = [{ type: 'Date', data: date_filters.data }, { type: 'Categories', data: categories.data }, { type: 'More Filters', data: more_filters.data }, { type: 'Price', data: prices.data }]
      },
      error: (res) => {
        this.toastr.error(res.message);
      }
    });
  }
}
