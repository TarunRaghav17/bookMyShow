import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IExploreListComponent } from '../../shared/components/i-explore-list/i-explore-list.component';
import { RouterModule, Routes } from '@angular/router';
import { MovieComponent } from '../explore/movies/landingpage/landingpage.component';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { FilterAccordianComponent } from '../../shared/components/filter-accordian/filter-accordian.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';

const routes:Routes=[
  {
path:'',
component: MovieComponent },
]

@NgModule({
  declarations: [MovieComponent],
  imports: [
    CommonModule,RouterModule.forChild(routes),TruncatePipe,FilterAccordianComponent,  CarouselModule,
  ]
})
export class IHomeModule { }
