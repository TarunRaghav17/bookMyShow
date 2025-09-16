import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminAccessRoutingModule } from './admin-access-routing.module';
import { UsersComponent } from './users/users.component';
import { ListYourShowComponent } from './list-your-show/list-your-show.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateVenueComponent } from './create-venue/create-venue.component';
import { ClickOutsideDirective } from '../../core/directive/click-out-side.directive';

@NgModule({
  declarations: [
    UsersComponent,
    ListYourShowComponent, CreateVenueComponent
  ],
  imports: [
    ReactiveFormsModule, CommonModule,
    ClickOutsideDirective,
    CommonModule,
    AdminAccessRoutingModule, CarouselModule, ReactiveFormsModule, FormsModule
  ]
})
export class AdminAccessModule { }
