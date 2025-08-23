import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IExploreListComponent } from '../../shared/components/i-explore-list/i-explore-list.component';

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
  }, {
    path: 'events',
    loadChildren: () => import('./events/events.module').then((m) => m.EventsModule)
  },

  {
    path:`:category-:city`,
    // component:IExploreListComponent
    loadChildren:()=>import('../i-home/i-home.module').then(m=>m.IHomeModule)

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExploreRoutingModule { }
