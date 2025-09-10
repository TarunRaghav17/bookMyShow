import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeLandingPageComponent } from './home-landingpage/home-landingpage.component';


const routes: Routes = [{ path: '', redirectTo: 'dashboard', pathMatch: 'full', }, { path: ':city', component: HomeLandingPageComponent },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
