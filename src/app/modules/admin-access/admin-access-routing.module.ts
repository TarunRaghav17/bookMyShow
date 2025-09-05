import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListYourShowComponent } from './list-your-show/list-your-show.component';
import { UsersComponent } from './users/users.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  { path: '', redirectTo: 'list-your-show', pathMatch: 'full' },
  { path: 'list-your-show', component: ListYourShowComponent },
  { path: 'users', component: UsersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes), NgbModule],
  exports: [RouterModule]
})
export class AdminAccessRoutingModule { }
