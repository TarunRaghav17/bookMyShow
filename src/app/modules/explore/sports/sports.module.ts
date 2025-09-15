import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SportsRoutingModule } from './sports-routing.module';
import { SportsPageComponent } from './sports-page/sports-page.component';
import { FilterAccordionComponent } from '../../../shared/components/filter-accordion/filter-accordion.component';
import { TruncatePipe } from '../../../core/pipes/truncate.pipe';


@NgModule({
  declarations: [
    SportsPageComponent
  ],
  imports: [
    CommonModule,
    SportsRoutingModule,
    FilterAccordionComponent,
    TruncatePipe
  ]
})
export class SportsModule { }
