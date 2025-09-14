import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule)
  },
  {
    path: 'movies',
    loadChildren: () => import('./movies/movies.module').then((m) => m.MoviesModule)
  },
  {
    path: 'events',
    loadChildren: () => import('./events/events.module').then((m) => m.EventsModule)
  },
  {
    path: 'activities',
    loadChildren: () => import('./activities/activities.module').then((m) => m.ActivitiesModule)

  },
  {
    path: 'sports',
    loadChildren: () => import('./sports/sports.module').then((m) => m.SportsModule)
  },
  {
    path: 'plays',
    loadChildren: () => import('./plays/plays.module').then((m) => m.PlaysModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExploreRoutingModule { }
