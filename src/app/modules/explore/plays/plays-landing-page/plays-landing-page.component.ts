import { Component } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { filters, movies, selectedFilters } from '../../../../../../db';

@Component({
  selector: 'app-plays-landing-page',
  standalone: false,
  templateUrl: './plays-landing-page.component.html',
  styleUrl: './plays-landing-page.component.scss'
})
export class PlaysLandingPageComponent {
  dummyMoviesdata: any[] = [];
  topFiltersArray: any[] = ['Hindi', 'English', 'Gujrati', 'Marathi', 'Malayalam', 'Punjabi', 'Telugu'];
  originalMovies = movies
  filters: any[] = filters
  select: any[] = selectedFilters

  constructor(public commonService: CommonService) {
    this.dummyMoviesdata = movies;
    this.commonService._selectedCategory.set('Plays');
  }


  ngOnInit(): void {
    this.topFiltersArray = this.filters.filter((item: any) => {
      if (item.type == 'Language') return item.data.filter((i: any) => i)
    })
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
