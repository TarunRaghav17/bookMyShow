import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlaysRoutingModule } from './plays-routing.module';
import { PlaysLandingPageComponent } from './plays-landing-page/plays-landing-page.component';
import { FilterAccordionComponent } from '../../../shared/components/filter-accordion/filter-accordion.component';
import { TruncatePipe } from '../../../core/pipes/truncate.pipe';


@NgModule({
  declarations: [
    PlaysLandingPageComponent
  ],
  imports: [
    CommonModule,
    PlaysRoutingModule,
    FilterAccordionComponent,
    TruncatePipe,
]
})
export class PlaysModule { }
