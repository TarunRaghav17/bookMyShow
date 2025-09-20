import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SportsRoutingModule } from './sports-routing.module';
import { SportsPageComponent } from './sports-page/sports-page.component';
import { FilterAccordionComponent } from '../../../shared/components/filter-accordion/filter-accordion.component';
import { TruncatePipe } from '../../../core/pipes/truncate.pipe';
import { MovieDetailsLoadingSkeltonComponent } from '../../../shared/components/movie-details-loading-skelton/movie-details-loading-skelton.component';
import { BuyTicketSkeltonLoaderComponent } from "../../../shared/components/buy-ticket-skelton-loader/buy-ticket-skelton-loader.component";


@NgModule({
  declarations: [
    SportsPageComponent
  ],
  imports: [
    CommonModule,
    SportsRoutingModule,
    FilterAccordionComponent,
    TruncatePipe,
    MovieDetailsLoadingSkeltonComponent,
    BuyTicketSkeltonLoaderComponent
]
})
export class SportsModule { }
