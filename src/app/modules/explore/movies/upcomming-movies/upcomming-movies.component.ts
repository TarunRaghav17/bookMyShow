import { Component } from '@angular/core';
import { filters, movies, selectedFilters, topFilters } from '../../../../../../db';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upcomming-movies',
  standalone: false,
  templateUrl: './upcomming-movies.component.html',
  styleUrl: './upcomming-movies.component.scss'
})
export class UpcommingMoviesComponent {
  dummyMoviesdata: any[] = [];
  selectedFilters: any[] = []
  selectedCity: any = null
  topFiltersArray: any[] = topFilters
  originalMovies = movies;
  filters: any[] = filters
  select: any[] = selectedFilters

  constructor(public commonService: CommonService, public router: Router) {
    this.dummyMoviesdata = movies;
    this.selectedCity = this.commonService._selectCity()
    this.commonService._selectedCategory.set('Movies');
  }
  ngOnit(): void {

  }

}
