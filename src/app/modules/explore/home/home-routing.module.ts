import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './landingpage/landingpage.component';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'delhi',
  //   pathMatch: 'full',
  // },
  // { path: 'delhi', component: HomeComponent },
  { path: ':city', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
