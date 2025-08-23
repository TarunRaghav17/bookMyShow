import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieComponent } from './landingpage/landingpage.component';
import { UpcommingMoviesComponent } from './upcomming-movies/upcomming-movies.component';

const routes: Routes = [
 
  // { path: ':city', component: MovieComponent },
  { path: 'upcoming-movies', component: UpcommingMoviesComponent },
 {
    path: '', redirectTo: '', pathMatch: 'full'},]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoviesRoutingModule { }
