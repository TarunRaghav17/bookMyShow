import { Component } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { AuthService } from '../../../auth/auth-service.service';
import { UserProfileService } from '../service/user-profile.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';

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
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
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
        this.getShowsData = res.data.content;
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

  /**
 * @description Convert base64 string to safe image URL for display
 * @author Gurmeet Kumar
 * @return any
 */
  getImageFromBase64(base64string: string): any {
    if (base64string) {
      const fullBase64String = `data:${base64string};base64,${base64string}`;
      return this.sanitizer.bypassSecurityTrustUrl(fullBase64String);
    }
  }
}
