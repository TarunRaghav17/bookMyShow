import { Component } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { movies } from '../../../../../../db';

@Component({
  selector: 'app-events-landingpage',
  standalone: false,
  templateUrl: './events-landingpage.component.html',
  styleUrl: './events-landingpage.component.scss'
})
export class EventsLandingPageComponent {
  dummyMoviesdata: any[] = [];
  originalMovies = movies
  constructor(public commonService: CommonService) {
    this.dummyMoviesdata = movies;
  }

}
