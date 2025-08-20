import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MoviesRoutingModule } from './movies-routing.module';
import { MovieComponent } from './movie/movie.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';


@NgModule({
  declarations: [
    MovieComponent
  ],
  imports: [
    CommonModule,
    MoviesRoutingModule,
    CarouselModule
  ]
})
export class MoviesModule { }
