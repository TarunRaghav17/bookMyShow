import {
  Component,
  effect,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  NgbModal,
  NgbModalOptions,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { UserAuthComponent } from '../../../auth/user-auth/user-auth.component';
import { CommonService } from '../../../services/common.service';
import { AuthService } from '../../../auth/auth-service.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @ViewChild('cityModal', { static: true }) cityModal!: TemplateRef<any>;
  cityData: any[] = [];
  citiesJson: any = null;
  showCities = false;
  selectedCity: any;
  selectedCityId: string = '';
  searchText: string = '';
  searchControl: FormControl = new FormControl()
  filteredCities: any[] = [];
  viewCitiesText: string = 'View All Cities';
  showProfileheader: any;
  notifications: boolean = false;
  notificationCount: number = 0;
  showNotificationData: any[] = [];
  public selectedCategory: string
  checkedLogin = signal<any | null>(null);
  page: number = 0;
  size: number = 10;
  totalCount: any;
  isLoading = false;
  scrollTimeout: any;

  constructor(
    private modalService: NgbModal,
    public commonService: CommonService,
    public authService: AuthService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private route: Router
  ) {
    this.selectedCategory = this.commonService._selectedCategory()
    this.selectedCity = this.commonService._selectCity()
    this.checkedLogin.set(this.authService.getUserFromToken());
    effect((onCleanup) => {
      const user = this.authService.userDetailsSignal();
      if (user) {
        const intervalId = setInterval(() => {
          this.getAllNotificationData();
        }, 5000);
        onCleanup(() => clearInterval(intervalId));
      }
    });
  }

  ngOnInit(): void {
    this.getAllPopularCity()
    this.getAllCitiesData()
    this.onSearchHandler()
    this.showProfileheader = this.commonService._profileHeader()
  }
  /**
     * @description Open city selection modal popup
     * @author Gurmeet Kumar
     * @return void
     */
  openCityModal(cityModal: TemplateRef<any>): void {
    this.modalService.open(cityModal, {
      modalDialogClass: 'dialog',
      backdrop: 'static',
      ariaLabelledBy: 'modal-basic-title',
    });
  }
  /**
   * @description Toggle between viewing all cities and popular cities only
   * @author Gurmeet Kumar
   * @return void
   */
  viewAllCities(): void {
    this.showCities = !this.showCities;
    this.viewCitiesText = this.showCities ? 'Hide All Cities' : 'View All Cities';
  }

  /**
   * @description Get popular cities from backend service & when is res Get poPularCity then Open CityModal
   * @author Gurmeet Kumar
   * @return void
   */
  getAllPopularCity(): void {
    this.commonService.getPopularCities().subscribe({
      next: (res) => {
        this.cityData = res.data;
        if (!this.selectedCity) {
          this.openCityModal(this.cityModal)
        }
      },
      error: (err) => {
        this.toastr.error(err.messsage);
      }
    });
  }

  /**
   * @description Open login/signup modal popup
   * @author Gurmeet Kumar
   * @return void
   */
  openLoginModal(): void {
    const modalOptions: NgbModalOptions = { centered: true };
    this.modalService.open(UserAuthComponent, modalOptions);
  }

  /**
   * @description Select city, update session storage, and close modal
   * @author Gurmeet Kumar
   * @return void
   */
  selectCity(city: any, cityId: string, modalRef: NgbModalRef): void {
    this.commonService._selectCity.set(city);
    this.selectedCity = this.commonService._selectCity();
    this.showCities = false
    this.route.navigate(['/explore/home/', city])
    sessionStorage.setItem('selectedCity', JSON.stringify(this.selectedCity));
    sessionStorage.setItem('selectedCityId', cityId);


    if (modalRef) {
      modalRef.close();
      this.searchControl.setValue('');
    }
  }
  /**
   * @description Logout user and clear token from storage
   * @author Gurmeet Kumar
   * @return void
   */
  logout(): void {
    const user = this.authService.userDetailsSignal();
    if (user?.userId) {
      this.authService.logout(user.userId).subscribe({
        next: (res: any) => {
          this.authService.clearUserDetails();
          this.route.navigate(['/']);
          this.toastr.success(res.message);
        },
        error: (err: any) => {
          this.toastr.error(err.message);
        }
      });
    } else {
      this.authService.clearUserDetails();
      this.route.navigate(['/']);
    }
  }

  /**
  * @description Only change Url here 
  * @author Gurmeet Kumar
  * @return void
  */

  /**
   * @description Get list of all cities from backend
   * @author Gurmeet Kumar
   * @return void
   */
  getAllCitiesData(): void {
    this.commonService.getAllCities().subscribe({
      next: (res) => {
        this.citiesJson = res.data;
      },
      error: (err) => {
        this.toastr.error(err.message);
      }
    });
  }

  /**
   * @description Filter cities by search input text
   * @author Gurmeet Kumar
   * @return void
   */
  /**
* @description Handles user search with debounce. Fetches all users if search input is empty, or searches users based on query.
* @author Gurmeet Kumar
* @return void
*/
  onSearchHandler() {
    this.searchControl.valueChanges.pipe(
      debounceTime(600),
      map((val) => val?.trim().toLowerCase() || ''),
      distinctUntilChanged(),
    ).subscribe({
      next: (val: string) => {
        this.searchText = val;
        if (!val) {
          this.filteredCities = [...this.citiesJson];
        } else {

          this.filteredCities = this.citiesJson.filter((city: any) =>
            city.cityName.toLowerCase().includes(val)
          );
        }
      },
      error: () => {
        this.filteredCities = [];
      }
    });
  }

  /**
   * @description Clear search input and filtered city list
   * @author Gurmeet Kumar
   * @return void
   */
  clearSearch() {
    this.searchControl.setValue('');
    this.filteredCities = [];
  }

  /**
   * @description Set selected category
   * @author Gurmeet Kumar
   * @param category 
   */
  onClickCategory(category: string) {
    this.commonService.setCategory(category);
    this.selectedCategory = this.commonService._selectedCategory();
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

  /**
  * @description Close cityModal 
  * @author Gurmeet Kumar
  * @return any
  * @param modalRef
  */

  closeCityModal(modalRef: NgbModalRef): void {
    if (modalRef) {
      modalRef.dismiss();
    }
  }

  /**
    * @description toggle for show Notification 
    * @author Gurmeet Kumar
    */
  showNotifications() {
    this.notifications = !this.notifications
  }

  /**
   * @description Get all notification data 
   * @author Gurmeet Kumar
   * @param userId pageNumber Count
   */
  getAllNotificationData() {
    const user = this.authService.userDetailsSignal();
    if (!user?.userId) return;
    this.commonService.getAllnotification(user.userId, this.page, this.size).subscribe({
      next: (res: any) => {
        this.totalCount = res.data.count;
        if (this.page === 0) {
          this.showNotificationData = res.data.content;
        } else {
          const newData = res.data.content.filter(
            (n: any) => !this.showNotificationData.some(existing => existing.notificationId === n.notificationId)
          );
          this.showNotificationData = [...this.showNotificationData, ...newData];
        }
      },
      error: (err) => this.toastr.error(err.message)
    });
    this.unreadNotifications();
  }

  /**
   * @description Mark as Read to notification  
   * @author Gurmeet Kumar
   * @params userId ,notificationId
   */
  markAsRead(notificationId: number) {
    const userId = this.authService.userDetailsSignal().userId;
    this.commonService.readNotification(userId, notificationId).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message);
        this.showNotificationData = this.showNotificationData.map(item =>
          item.notificationId === notificationId ? { ...item, read: true } : item
        );
      },
      error: (err) => {
        this.toastr.error(err.message);
      }
    });
  }

  /**
 * @description unread Notification Data Count 
 * @author Gurmeet Kumar
 * @param userId pageNumber Count
 */

  unreadNotifications() {
    const userId = this.authService.userDetailsSignal().userId
    this.commonService.unReadNotification(userId).subscribe({
      next: (res: any) => {
        this.notificationCount = res.data
      }
    })
  }

  /**
  * @description timeFormate Convert to actualdate
  * @author Gurmeet Kumar
  * @param userId pageNumber Count
  */
  getShortTimeAgo(dateString: string | Date): string {
    const date =
      typeof dateString === 'string'
        ? new Date(dateString)
        : dateString;
    const istDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
    const now = new Date();
    let diffInSeconds = Math.floor((now.getTime() - istDate.getTime()) / 1000);
    if (diffInSeconds < 0) diffInSeconds = 0;
    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 30) return `${days}d ago`;
    if (months < 12) return `${months}M ago`;
    return `${years}y ago`;
  }



  /**
  * @description Scroll Event to load the data
  * @author Gurmeet Kumar
  * @param userId pageNumber Count
  */
  onScroll() {
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      const allLoaded = this.showNotificationData.length >= this.totalCount;
      if (allLoaded || this.isLoading) return;
      this.page++;
      this.getAllNotificationData();
    }, 500);
  }
  /**
   * @description notications container Show 
   * @author Gurmeet
   */
  openCanvas() {
    this.notifications = false;
    this.page = 0
  }
}