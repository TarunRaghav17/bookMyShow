import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaysLandingPageComponent } from './plays-landing-page/plays-landing-page.component';

const routes: Routes = [
  {
    path: '',
    component: PlaysLandingPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaysRoutingModule { }
