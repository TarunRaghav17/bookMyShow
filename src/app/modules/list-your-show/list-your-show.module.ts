import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListYourShowRoutingModule } from './list-your-show-routing.module';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { LandingpageComponent } from './landingpage/landingpage.component';

@NgModule({
  declarations: [
    LandingpageComponent
  ],
  imports: [
    CommonModule,
    CarouselModule,
    ListYourShowRoutingModule,

  ]
})
export class ListYourShowModule { }
