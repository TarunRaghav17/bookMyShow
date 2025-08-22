import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { FilterAccordianComponent } from '../../../shared/components/filter-accordian/filter-accordian.component';
import { LandingpageComponent } from './landingpage/landingpage.component';

@NgModule({
  declarations: [
    LandingpageComponent,

  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    FilterAccordianComponent,
    TruncatePipe


  ]
})
export class EventsModule { }
