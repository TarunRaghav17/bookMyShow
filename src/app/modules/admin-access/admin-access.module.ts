import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminAccessRoutingModule } from './admin-access-routing.module';
import { UsersComponent } from './users/users.component';
import { ListYourShowComponent } from './list-your-show/list-your-show.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateVenueComponent } from './create-venue/create-venue.component';
import { CreateShowComponent } from './create-show/create-show.component';
import { ClickOutsideDirective } from '../../core/directive/click-out-side.directive';
import { CreateContentComponent } from './create-content/create-content.component';
import { ListVenuesComponent } from './list-venues/list-venues.component';
import { ListContentsComponent } from './list-contents/list-contents.component';
import { NumberFormatPipe } from '../../core/pipes/number-format.pipe';

@NgModule({
  declarations: [
    UsersComponent,
    ListYourShowComponent, CreateVenueComponent, CreateShowComponent,CreateContentComponent,ListVenuesComponent, ListContentsComponent
  ],
  imports: [NgbModule,NumberFormatPipe,
    ReactiveFormsModule, CommonModule,
    ClickOutsideDirective,
    CommonModule,
    AdminAccessRoutingModule, CarouselModule, ReactiveFormsModule, FormsModule,
  ]
})
export class AdminAccessModule { }
