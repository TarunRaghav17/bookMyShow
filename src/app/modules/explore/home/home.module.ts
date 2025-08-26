import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home-landingpage/home-landingpage.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, HomeRoutingModule, CarouselModule, TruncatePipe],
})
export class HomeModule { }
