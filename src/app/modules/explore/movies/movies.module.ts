import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MoviesRoutingModule } from './movies-routing.module';
import { MovieComponent } from './movies-landingpage/movies-landingpage.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { UpcommingMoviesComponent } from './upcomming-movies/upcomming-movies.component';
import { FilterAccordionComponent } from '../../../shared/components/filter-accordion/filter-accordion.component';


@NgModule({
  declarations: [
    MovieComponent,
    UpcommingMoviesComponent
  ],
  imports: [
    CommonModule,
    MoviesRoutingModule,
    CarouselModule,
    TruncatePipe,
    FilterAccordionComponent
  ]
})
export class MoviesModule { }
