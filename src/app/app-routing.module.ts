import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MoviesDetailsComponent } from './shared/components/movies-details/movies-details.component';
import { ErrorPageComponent } from './shared/components/error-page/error-page.component';
import { TheatreListComponent } from './shared/components/theatre-list/theatre-list.component';
import { BuyTicketsComponent } from './shared/components/buy-tickets/buy-tickets.component';
import { SeatLayoutComponent } from './shared/components/seat-layout/seat-layout.component';
import { AuthGuard } from './auth/gaurds/auth.guard';
import { EventsdetailsComponent } from './shared/components/eventsdetails/eventsdetails.component';


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
    data: { role: 'USER' },
    loadChildren: () =>
      import('./modules/user-proile/user-profile.module').then((m) => m.UserProfileModule),
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' },
    loadChildren: () => import('./modules/admin-access/admin-access.module').then((m) => m.AdminAccessModule)
  },
  {
    path: 'movies/:city/:id', component: MoviesDetailsComponent

  },
  {
    path: ':city/cinemas', component: TheatreListComponent
  },
  {
    path: 'movies/:city/:name/buytickets/:id', component: BuyTicketsComponent
  },
  {
    path: 'movies/:city/seat-layout/:movieId/:theatreId/:showId/:date',
    component: SeatLayoutComponent
  },
  {
    path: ':category/:play-name/:id',
    component: EventsdetailsComponent
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
