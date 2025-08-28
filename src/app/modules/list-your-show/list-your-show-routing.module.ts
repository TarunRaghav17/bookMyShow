import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListYourShowLandingPageComponent } from './list-your-show-landing-page/list-your-show-landing-page.component';

const routes: Routes = [
  { path: '', component: ListYourShowLandingPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListYourShowRoutingModule { }
