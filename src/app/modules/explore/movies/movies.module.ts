import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MoviesRoutingModule } from './movies-routing.module';
import { MovieComponent } from './landingpage/landingpage.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { FilterAccordianComponent } from "../../../shared/components/filter-accordian/filter-accordian.component";
import { UpcommingMoviesComponent } from './upcomming-movies/upcomming-movies.component';


@NgModule({
  declarations: [
    // MovieComponent,
    UpcommingMoviesComponent
  ],
  imports: [
    CommonModule,
    MoviesRoutingModule,
    CarouselModule,
    // TruncatePipe,
    FilterAccordianComponent
  ]
})
export class MoviesModule { }
