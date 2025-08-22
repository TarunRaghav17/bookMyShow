import { Component } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { movies } from '../../../../../../db';

@Component({
  selector: 'app-landingpage',
  standalone: false,
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss'
})
export class LandingpageComponent {
  dummyMoviesdata: any[] = [];
  dummyMoviesdatafiltered: any[] = []
  originalMovies = movies


  constructor(public commonService: CommonService) {
    this.dummyMoviesdata = movies;
  }

}
