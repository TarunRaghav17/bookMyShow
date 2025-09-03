import { Component } from '@angular/core';
import { filters, movies, selectedFilters } from '../../../../../../db';
import { CommonService } from '../../../../services/common.service';
import { resetfilterAccordian } from '../../../../../../util';

@Component({
  selector: 'app-sports-page',
  standalone: false,
  templateUrl: './sports-page.component.html',
  styleUrl: './sports-page.component.scss'
})
export class SportsPageComponent {
  dummyMoviesdata: any[] = [];
  topFiltersArray: any[] = ['Hindi', 'English', 'Gujrati', 'Marathi', 'Malayalam', 'Punjabi', 'Telugu'];
  originalMovies = movies
  filters: any[] = filters
  select: any[] = selectedFilters

  constructor(public commonService: CommonService) {
    this.dummyMoviesdata = movies;
    this.commonService._selectedCategory.set('Sports');
  }
  ngOnInit(): void {
    this.topFiltersArray = this.filters.filter((item: any) => {
      if (item.type == 'Language') return item.data.filter((i: any) => i)
    })
  }
  ngOnDestroy() {
    resetfilterAccordian(this.filters)
  }

  handleEventFilter(filter: any) {
    console.log(filter)
    // make selected filter appear background red
    this.filters.filter((item: any) => {
      if (item.type == filter.type) {
        item.data.filter((i: any) => {
          if (i.text == filter.filterName.text) {
            i.selected = !i.selected
          }

        })
      }

    }
    )
    let filterType: any[] = this.select.filter((item: any) =>
      item.type == filter.type
    )
    if (filterType) {
      let alreayExist = filterType[0].data.filter((i: any) => i.text == filter.filterName.text)
      if (alreayExist.length == 0) {
        filterType[0].data.push(filter.filterName)
        return filterType[0].data.sort((a: any, b: any) => a.index - b.index)
      }
      else {
        filterType[0].data = filterType[0].data.filter((i: any) => i.text != filter.filterName.text)

      }

    }

  }

}
