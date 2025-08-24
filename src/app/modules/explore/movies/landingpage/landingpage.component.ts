import { Component, OnDestroy } from '@angular/core';
import { movies } from '../../../../../../db';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-movie',
  standalone: false,
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss'
})
export class MovieComponent implements OnDestroy {
  dummyMoviesdata: any[] = [];
  dummyMoviesdatafiltered: any[] = []
  originalMovies = movies


  constructor(public commonService: CommonService) {
    this.dummyMoviesdata = movies;
  }

  ngOnDestroy(){
this.commonService.setSelectedCategory(null)
  }

}
