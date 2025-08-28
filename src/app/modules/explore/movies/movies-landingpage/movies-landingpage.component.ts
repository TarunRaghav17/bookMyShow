import { Component } from '@angular/core';
import { movies } from '../../../../../../db';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-movie',
  standalone: false,
  templateUrl: './movies-landingpage.component.html',
  styleUrl: './movies-landingpage.component.scss'
})
export class MovieLandingPageComponent {
  dummyMoviesdata: any[] = [];

  originalMovies = movies

  constructor(public commonService: CommonService) {
    this.dummyMoviesdata = movies;
  }

}
