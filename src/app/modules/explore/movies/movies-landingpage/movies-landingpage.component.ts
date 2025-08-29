import { Component } from '@angular/core';
import { movies } from '../../../../../../db';
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
  selectedFilters: any[] = []
  selectedCity: any = null
  topFiltersArray: any[] = ['Hindi', 'English', 'Gujrati', 'Marathi', 'Malayalam', 'Punjabi', 'Telugu'];
  originalMovies = movies;

  constructor(public commonService: CommonService, public router: Router) {
    this.dummyMoviesdata = movies;
    this.selectedCity = this.commonService._selectCity()
  }

  handleEventFilter(filter: any) {
    this.selectedFilters.push(filter)
  }



}
