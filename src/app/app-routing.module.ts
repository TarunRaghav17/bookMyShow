import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoviesDetailsComponent } from './shared/components/movies-details/movies-details.component';
import { ErrorPageComponent } from './shared/components/error-page/error-page.component';
import { TheatreListComponent } from './shared/components/theatre-list/theatre-list.component';
import { BuyTicketsComponent } from './shared/components/buy-tickets/buy-tickets.component';
import { SeatLayoutComponent } from './shared/components/seat-layout/seat-layout.component';
import { EventsDetailsComponent } from './shared/components/events-details/events-details.component';
import { BookingEventsComponent } from './shared/components/booking-events/booking-events.component';
// import { AuthGuard } from './auth/gaurds/auth.guard';

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
    path: 'admin',
    // canActivate: [AuthGuard],
    data: { role: 'ADMIN' },
    loadChildren: () => import('./modules/admin-access/admin-access.module').then((m) => m.AdminAccessModule)
  },
  {
    path: 'movie/:city/:id', component: MoviesDetailsComponent
  },
  {
    path: ':city/cinemas', component: TheatreListComponent
  },
  {
    path: 'movies/:city/:name/buytickets/:id', component: BuyTicketsComponent
  },
  {
    path: 'movies/:city/seat-layout/:movieId/:theatreId/:screenId/:showId/:date',
    component: SeatLayoutComponent
  },
  {
    path: 'book-events/:category/:eventname/:id/:date',
    component: BookingEventsComponent
  },
  {
    path: ':category/:eventname/:id',
    component: EventsDetailsComponent
  },
  {
    path: '**',
    component: ErrorPageComponent
  }
];

@NgModule({
  imports: [
     RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top', 
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
