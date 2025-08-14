import { Component } from '@angular/core';
import { movies } from '../../../../../db';
@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  dummyMoviesdata: any[] = [];

  constructor() {
    this.dummyMoviesdata = movies;
    console.log(this.dummyMoviesdata);
  }
}
