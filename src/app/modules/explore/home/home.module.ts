import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeLandingPageComponent } from './home-landingpage/home-landingpage.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TruncatePipe } from '../../../core/pipes/truncate.pipe';
import { NumberFormatPipe } from '../../../core/pipes/number-format.pipe';

@NgModule({
  declarations: [HomeLandingPageComponent],
  imports: [CommonModule, HomeRoutingModule, CarouselModule, TruncatePipe,NumberFormatPipe],
})
export class HomeModule { }
