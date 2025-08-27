import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieLandingPageComponent } from './movies-landingpage/movies-landingpage.component';
import { UpcommingMoviesComponent } from './upcomming-movies/upcomming-movies.component';

const routes: Routes = [

  { path: '', component: MovieLandingPageComponent },
  { path: 'upcoming-movies', component: UpcommingMoviesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoviesRoutingModule { }
