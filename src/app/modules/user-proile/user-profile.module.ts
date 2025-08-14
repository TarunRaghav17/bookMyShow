import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { YourOrderComponent } from './your-order/your-order.component';

@NgModule({
  declarations: [YourOrderComponent],
  imports: [CommonModule, UserProfileRoutingModule],
})
export class UserProfileModule {}
