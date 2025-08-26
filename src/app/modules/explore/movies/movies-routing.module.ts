import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieComponent } from './movies-landingpage/movies-landingpage.component';
import { UpcommingMoviesComponent } from './upcomming-movies/upcomming-movies.component';

const routes: Routes = [
  {
    path: '', redirectTo: '', pathMatch: 'full'
  },
  { path: '', component: MovieComponent },
  { path: 'upcoming-movies', component: UpcommingMoviesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoviesRoutingModule { }
