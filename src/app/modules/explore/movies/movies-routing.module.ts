import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieComponent } from './landingpage/landingpage.component';

const routes: Routes = [
  {
    path: '', redirectTo: '', pathMatch: 'full'
  },
  { path: '', component: MovieComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoviesRoutingModule { }
