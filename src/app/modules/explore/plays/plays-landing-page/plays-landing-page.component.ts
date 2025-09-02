import { Component } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { movies } from '../../../../../../db';

@Component({
  selector: 'app-plays-landing-page',
  standalone: false,
  templateUrl: './plays-landing-page.component.html',
  styleUrl: './plays-landing-page.component.scss'
})
export class PlaysLandingPageComponent {
  dummyMoviesdata: any[] = [];
  originalMovies = movies
  
  constructor(public commonService: CommonService) {
    this.dummyMoviesdata = movies;
    this.commonService._selectedCategory.set('Plays');
  }

}
