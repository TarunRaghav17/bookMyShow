import { Component } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { AuthService } from '../../../auth/auth-service.service';
import { UserProfileService } from '../service/user-profile.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-your-order',
  standalone: false,
  templateUrl: './your-order.component.html',
  styleUrl: './your-order.component.scss'
})
export class YourOrderComponent {
  getShowsData: any[] = []
  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private toastr: ToastrService
  ) {

  }
  ngOnInit(): void {
    this.commonService._profileHeader.set(true)
    this.getBookingsByuserId()
  }


  /**
   * @deprecation bookings data by userId
   * @author Gurmeet Kumar
   */
  getBookingsByuserId() {
    const userId = this.authService.userDetailsSignal().userId;
    this.userProfileService.getAllShowByUserId(userId).subscribe({
      next: (res: any) => {
        this.getShowsData = res.data;
      }, error: (err: any) => {
        this.toastr.error(err.message)
      }
    })
  }
  /**
   * @description on profile header false
   * @author Gurmeet Kumar 
   */
  ngOnDestroy() {
    this.commonService._profileHeader.set(false)
  }
}
