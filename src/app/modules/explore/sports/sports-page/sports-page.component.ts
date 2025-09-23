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
  dummyMoviesdata: any[] | null = null
  topFiltersArray: any[] = topFilters
  originalMovies = movies
  filters: any[] = []
  select: any[] = selectedFilters
  sendPayload: any = {
    "type": "string",
    "dateFilters": [],
    "categories": [],
    "morefilter": [],
    "prices": [],
  }

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
    this.sendPayload.type = 'Sports'
    this.getAllSports()

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

  getAllSports() {
    this.sportService.getAllSports(this.sendPayload).subscribe({
      next: (res) => {
        this.dummyMoviesdata = res.data
      },
      error: (err) => {
        this.toastr.error(err.message);
      }
    })
  }
  setFilter() {
    forkJoin([
      this.sportService.getFilters('date_filters'),
      this.sportService.getFilters('categories'),
      this.sportService.getFilters('more_filters'),
      this.sportService.getFilters('prices')
    ]).subscribe({
      next: ([date_filters, categories, more_filters, prices]) => {
        let filters = [{ type: 'Date', data: date_filters.data }, { type: 'Categories', data: categories.data }, { type: 'More Filters', data: more_filters.data }, { type: 'Price', data: prices.data }]
        this.commonService.setFiltersSignal(filters)
      },
      error: (err) => {
        this.toastr.error(err.message);
      }
    });
  }

  toggleId(array: any[], id: any): void {
    const index = array.indexOf(id);
    if (index > -1) {
      array.splice(index, 1);
    } else {
      array.push(id);
    }
  }
  getFilter(event: any) {
    switch (event.type) {
      case 'Date':
        this.toggleId(this.sendPayload.dateFilters, event.filterName.dateFilterId);
        break;

      case 'Categories':
        this.toggleId(this.sendPayload.categories, event.filterName.categoryId);
        break;

      case 'More Filters':
        this.toggleId(this.sendPayload.morefilter, event.filterName.moreFilterId);
        break;

      case 'Prices':
        this.toggleId(this.sendPayload.price, event.filterName.priceId);
        break;
    }
    this.getAllSports()
    this.commonService.handleEventFilter(event)
  }
  clearFilter(item: any) {
    if(!item.type) return ;
    switch(item){
      case 'Date':
      this.sendPayload.dateFilters=[]
      break;

      case 'Categories':
      this.sendPayload.categories=[]
      break;

      case 'More Filters':
      this.sendPayload.morefilter=[]
      break;

      case 'Prices':
      this.sendPayload.Price=[]
      break;

    }
    this.getAllSports()
  }

}
