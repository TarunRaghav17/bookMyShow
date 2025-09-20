import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitiesRoutingModule } from './activities-routing.module';
import { ActivitiesPageComponent } from './activities-page/activities-page.component';
import { FilterAccordionComponent } from '../../../shared/components/filter-accordion/filter-accordion.component';
import { TruncatePipe } from '../../../core/pipes/truncate.pipe';
import { CommonService } from '../../../services/common.service';
import { BuyTicketSkeltonLoaderComponent } from "../../../shared/components/buy-ticket-skelton-loader/buy-ticket-skelton-loader.component";


@NgModule({
  declarations: [
    ActivitiesPageComponent
  ],
  imports: [
    CommonModule,
    ActivitiesRoutingModule,
    FilterAccordionComponent,
    TruncatePipe,
 
    BuyTicketSkeltonLoaderComponent
]
})
export class ActivitiesModule {

  constructor(public commonService: CommonService) {
    this.commonService._selectedCategory.set('Activities');
  }
}

