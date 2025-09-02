import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminAccessRoutingModule } from './admin-access-routing.module';
import { UsersComponent } from './users/users.component';
import { ListYourShowComponent } from './list-your-show/list-your-show.component';


@NgModule({
  declarations: [
    UsersComponent,
    ListYourShowComponent
  ],
  imports: [
    CommonModule,
    AdminAccessRoutingModule
  ]
})
export class AdminAccessModule { }
