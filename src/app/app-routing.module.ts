import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeModule } from './modules/home/home.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'explore',
    pathMatch: 'full',
  },
  {
    path: 'explore',
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => HomeModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
