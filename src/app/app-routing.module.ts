import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserProfileModule } from './modules/user-proile/user-profile.module';
import { MoviesDetailsComponent } from './shared/components/movies-details/movies-details.component';
import { ListYourShowModule } from './modules/list-your-show/list-your-show.module';
import { ErrorpageComponent } from './shared/components/errorpage/errorpage.component';

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
      import('./modules/user-proile/user-profile.module').then((m) => UserProfileModule),
  },
  {
    path: 'list-your-show',
    loadChildren: () =>
      import('./modules/list-your-show/list-your-show.module').then((m) => ListYourShowModule),
  },
  {
    path: 'movies/:city/:name/:id', component: MoviesDetailsComponent

  },
  {
    path: '**',
    component: ErrorpageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
