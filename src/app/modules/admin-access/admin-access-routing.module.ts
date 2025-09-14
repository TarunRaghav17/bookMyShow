import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListYourShowComponent } from './list-your-show/list-your-show.component';
import { UsersComponent } from './users/users.component';
import { CreateVenueComponent } from './create-venue/create-venue.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateShowComponent } from './create-show/create-show.component';

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
  },
     /**
  * @description route to access /admin/create/shows to create show 
  * @author Inzamam
  */
  {
    path:'create/show',
    component:CreateShowComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), NgbModule],
  exports: [RouterModule]
})
export class AdminAccessRoutingModule { }
