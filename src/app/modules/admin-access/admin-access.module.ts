import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminAccessRoutingModule } from './admin-access-routing.module';
import { UsersComponent } from './users/users.component';
import { ListYourShowComponent } from './list-your-show/list-your-show.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateVenueComponent } from './create-venue/create-venue.component';
import { CreateShowComponent } from './create-show/create-show.component';
import { ClickOutsideDirective } from '../../core/directive/click-out-side.directive';
import { CreateContentComponent } from './create-content/create-content.component';

@NgModule({
  declarations: [
    UsersComponent,
    ListYourShowComponent, CreateVenueComponent, CreateShowComponent,CreateContentComponent 
  ],
  imports: [
    ReactiveFormsModule, CommonModule,
    ClickOutsideDirective,
    CommonModule,
    AdminAccessRoutingModule, CarouselModule, ReactiveFormsModule, FormsModule,
  ]
})
export class AdminAccessModule { }
