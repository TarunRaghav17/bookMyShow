import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { eventsLandingpageComponent } from './events-landingpage/events-landingpage.component';
import { fiLocale } from 'ngx-bootstrap/chronos';
import { FilterAccordionComponent } from '../../../shared/components/filter-accordion/filter-accordion.component';

@NgModule({
  declarations: [
    eventsLandingpageComponent
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    TruncatePipe,
    FilterAccordionComponent


  ]
})
export class EventsModule { }
