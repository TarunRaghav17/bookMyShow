import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListYourShowRoutingModule } from './list-your-show-routing.module';
import { ListYourShowLandingPageComponent } from './list-your-show-landing-page/list-your-show-landing-page.component';


@NgModule({
  declarations: [ListYourShowLandingPageComponent],
  imports: [
    CommonModule,
    ListYourShowRoutingModule
  ]
})
export class ListYourShowModule { }
