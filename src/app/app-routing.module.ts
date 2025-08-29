import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MoviesDetailsComponent } from './shared/components/movies-details/movies-details.component';
import { ErrorPageComponent } from './shared/components/error-page/error-page.component';
import { TheatreListComponent } from './shared/components/theatre-list/theatre-list.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'explore',
    pathMatch: 'full',
  },
  {
    path: 'explore',
    loadChildren: () => import('./modules/explore/explore.module').then((m) => m.ExploreModule)
  },
  {
    path: 'my-profile',
    loadChildren: () =>
      import('./modules/user-proile/user-profile.module').then((m) => m.UserProfileModule),
  },
  {
    path: 'list-your-show',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/list-your-show/list-your-show.module').then((m) => m.ListYourShowModule)
  },
  {
    path: 'movies/:city/:id', component: MoviesDetailsComponent

  },
  {
    path: ':city/cinemas', component: TheatreListComponent
  },
  {
    path: '**',
    component: ErrorPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
