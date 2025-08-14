import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { YourOrderComponent } from './your-order/your-order.component';

const routes: Routes = [
  { path: '', redirectTo: 'edit', pathMatch: 'full' },
  {
    path: 'edit',
    component: ProfileComponent,
  },
  {
    path: 'your-order',
    component: YourOrderComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserProfileRoutingModule {}
