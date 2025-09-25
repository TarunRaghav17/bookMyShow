import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsRoutingModule } from './events-routing.module';
import { TruncatePipe } from '../../../core/pipes/truncate.pipe';
import { EventsLandingPageComponent } from './events-landingpage/events-landingpage.component';
import { FilterAccordionComponent } from '../../../shared/components/filter-accordion/filter-accordion.component';

@NgModule({
  declarations: [
    EventsLandingPageComponent
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    TruncatePipe,
    FilterAccordionComponent,
]
})
export class EventsModule { }
