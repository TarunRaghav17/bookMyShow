import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminAccessRoutingModule } from './admin-access-routing.module';
import { UsersComponent } from './users/users.component';
import { ListYourShowComponent } from './list-your-show/list-your-show.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateVenueComponent } from './create-venue/create-venue.component';
import { CreateShowComponent } from './create-show/create-show.component';

@NgModule({
  declarations: [
    UsersComponent,
    ListYourShowComponent, CreateVenueComponent, CreateShowComponent
  ],
  imports: [
    ReactiveFormsModule, CommonModule,
    CommonModule,
    AdminAccessRoutingModule, CarouselModule, ReactiveFormsModule, FormsModule,
  ]
})
export class AdminAccessModule { }
