import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MoviesDetailsComponent } from './shared/components/movies-details/movies-details.component';
import { ErrorPageComponent } from './shared/components/error-page/error-page.component';
import { AuthGuard } from './auth/gaurds/auth.gaurd';
import { BuyTicketsComponent } from './shared/components/buy-tickets/buy-tickets.component';
import { SeatLayoutComponent } from './shared/components/seat-layout/seat-layout.component';


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
    canActivate: [AuthGuard],
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
    path: 'movies/:city/:name/buytickets/:id', component: BuyTicketsComponent
  },
  {
    path: 'movies/:city/seat-layout/:movieId/:theatreId/:showId/:date',
    component: SeatLayoutComponent
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
