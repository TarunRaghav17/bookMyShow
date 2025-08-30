import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SportsPageComponent } from './sports-page/sports-page.component';

const routes: Routes = [
  {
    path: '',
    component: SportsPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SportsRoutingModule { }
