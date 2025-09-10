import { Component, OnInit } from '@angular/core';
import { movies } from '../../../../../../db';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home-landingpage.component.html',
  styleUrl: './home-landingpage.component.scss',
})
export class HomeLandingPageComponent implements OnInit {
  dummyMoviesdata: any[] = [];
  moviesFilteredData: any[] = []
  originalMovies = movies
  pageNo = 0;
  itemsPerCards = 6;

  ngOnInit(): void {
    
  }
  start = 0
  end = 0
  constructor(
  ) {
    this.dummyMoviesdata = movies;
    this.getVisibleMovieCard()
  }


  /**
    * @description carousel  cards data 
    * @author  Inzamam,
    */
  getVisibleMovieCard() {
    this.start = this.itemsPerCards * this.pageNo;
    this.end = this.start + this.itemsPerCards
    this.moviesFilteredData = this.originalMovies.slice(this.start, this.end);
  }

  /**
   * @description next i have click to get 6 cards
   * @author  Inzamam,
   */
  next() {
    if (this.end < this.originalMovies.length) {
      this.pageNo++;
      this.getVisibleMovieCard();
    }
  }
  /**
   * @description prev i have click to get back 6 cards
   * @author Gurmeet Kumar,
   */
  prev() {
    if (this.start > 0) {
      this.pageNo--;
      this.getVisibleMovieCard();
    }
  }

}
