import { Component } from '@angular/core';
import { filters, movies, selectedFilters } from '../../../../../../db';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-activities-page',
  standalone: false,
  templateUrl: './activities-page.component.html',
  styleUrl: './activities-page.component.scss'
})
export class ActivitiesPageComponent {
  dummyMoviesdata: any[] = [];
  originalMovies = movies

  filters: any[] = filters

  select: any[] = selectedFilters

  topFiltersArray: any[] = ['Hindi', 'English', 'Gujrati', 'Marathi', 'Malayalam', 'Punjabi', 'Telugu'];
  constructor(public commonService: CommonService) {
    this.dummyMoviesdata = movies;
    this.commonService._selectedCategory.set('Activities');
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
