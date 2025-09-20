import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MoviesRoutingModule } from './movies-routing.module';
import { MovieLandingPageComponent } from './movies-landingpage/movies-landingpage.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TruncatePipe } from '../../../core/pipes/truncate.pipe';
import { UpcommingMoviesComponent } from './upcomming-movies/upcomming-movies.component';
import { FilterAccordionComponent } from '../../../shared/components/filter-accordion/filter-accordion.component';
import { NumberFormatPipe } from '../../../core/pipes/number-format.pipe';
import { BuyTicketSkeltonLoaderComponent } from "../../../shared/components/buy-ticket-skelton-loader/buy-ticket-skelton-loader.component";


@NgModule({
  declarations: [
    MovieLandingPageComponent,
    UpcommingMoviesComponent
  ],
  imports: [
    CommonModule,
    MoviesRoutingModule,
    CarouselModule,
    TruncatePipe,
    FilterAccordionComponent,
    NumberFormatPipe,
    BuyTicketSkeltonLoaderComponent
]
})
export class MoviesModule { }
