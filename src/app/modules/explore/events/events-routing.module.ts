import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { eventsLandingpageComponent } from './events-landingpage/events-landingpage.component';

const routes: Routes = [
  { path: '', component: eventsLandingpageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
