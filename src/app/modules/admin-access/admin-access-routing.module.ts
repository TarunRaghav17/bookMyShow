import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListYourShowComponent } from './list-your-show/list-your-show.component';
import { UsersComponent } from './users/users.component';
import { CreateVenueComponent } from './create-venue/create-venue.component';

const routes: Routes = [
  { path: '', redirectTo: 'list-your-show', pathMatch: 'full' },
  { path: 'list-your-show', component: ListYourShowComponent },
  { path: 'users', component: UsersComponent },


   /**
  * @description route to access /admin/create/venue to create venue 
  * @author Inzamam
  */
  {
    path:'create/venue',
    component:CreateVenueComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminAccessRoutingModule { }
