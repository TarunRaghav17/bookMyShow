import { Component } from '@angular/core';
import { Filters, movies, selectedFilters } from '../../../../../../db';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie',
  standalone: false,
  templateUrl: './movies-landingpage.component.html',
  styleUrl: './movies-landingpage.component.scss'
})
export class MovieLandingPageComponent {
  dummyMoviesdata: any[] = [];
  selectedCity: any = null
  topFiltersArray: any[] = ['Hindi', 'English', 'Gujrati', 'Marathi', 'Malayalam', 'Punjabi', 'Telugu'];
  originalMovies = movies;
  filters = Filters
  select = selectedFilters


  constructor(public commonService: CommonService, public router: Router) {
    this.dummyMoviesdata = movies;
    this.selectedCity = this.commonService._selectCity()
    this.commonService._selectedCategory.set('Movies');
  }
  ngOnInit(): void {
    this.topFiltersArray = this.filters.filter((item: any) => {
      if (item.type == 'Language') return item.data.filter((i: any) => i)
    })
  }
  handleEventFilter(filter: any) {
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
