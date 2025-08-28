import { Component, OnInit } from '@angular/core';
import { movies } from '../../../../../../db';
import { AuthService } from '../../../../auth/auth-service.service';

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
  start = 0
  end = 0
  constructor(private authService: AuthService) {
    this.dummyMoviesdata = movies;

    this.getVisibleMovieCard()
  }
  ngOnInit(): void {
    let userDetails = this.authService.userTokenDataSignal()
    console.log(userDetails)
  }
  getVisibleMovieCard() {
    this.start = this.itemsPerCards * this.pageNo;
    this.end = this.start + this.itemsPerCards
    this.moviesFilteredData = this.originalMovies.slice(this.start, this.end);
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
