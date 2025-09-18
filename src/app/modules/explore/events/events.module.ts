import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsRoutingModule } from './events-routing.module';
import { TruncatePipe } from '../../../core/pipes/truncate.pipe';
import { EventsLandingPageComponent } from './events-landingpage/events-landingpage.component';
import { FilterAccordionComponent } from '../../../shared/components/filter-accordion/filter-accordion.component';
import { BuyTicketSkeltonLoaderComponent } from "../../../shared/components/buy-ticket-skelton-loader/buy-ticket-skelton-loader.component";

@NgModule({
  declarations: [
    EventsLandingPageComponent
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    TruncatePipe,
    FilterAccordionComponent,
    BuyTicketSkeltonLoaderComponent
]
})
export class EventsModule { }
