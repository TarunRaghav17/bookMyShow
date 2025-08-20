import { Component, ElementRef, ViewChild } from '@angular/core';
import { movies } from '../../../../../db';
@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss',
})
export class HomeComponent {
  dummyMoviesdata: any[] = [];
  dummyMoviesdatafiltered: any[] = []
  originalMovies = movies
  pageNo = 0;
  itemsperpage = 6;
  start = 0
  end = 0
  constructor() {
    this.dummyMoviesdata = movies;
    this.getVisibleMovieCard()
  }



  getVisibleMovieCard() {
    this.start = this.itemsperpage * this.pageNo;
    this.end = this.start + this.itemsperpage
    this.dummyMoviesdatafiltered = this.originalMovies.slice(this.start, this.end);
  }



  next() {
    if (this.end < this.originalMovies.length) {
      this.pageNo++;
      this.getVisibleMovieCard();
    }
  }

  prev() {
    if (this.start > 0) {
      this.pageNo--;
      this.getVisibleMovieCard();
    }
  }

}
