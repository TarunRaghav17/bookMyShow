import {
  Component,
  OnInit,
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
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { FormControl } from '@angular/forms';

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
  searchText: string = '';
  city = false;
  searchControl: FormControl = new FormControl()
  filteredCities: any[] = [];
  viewCitiesText: string = 'View All Cities';
  showProfileheader: any;
  public selectedCategory: string
  constructor(
    private modalService: NgbModal,
    public commonService: CommonService,
    public authService: AuthService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private router: Router,
  ) {

    this.selectedCategory = this.commonService._selectedCategory()
    this.selectedCity = this.commonService._selectCity()
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
      error: (error) => {
        this.toastr.error(error);
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
  selectCity(city: any, modalRef: NgbModalRef): void {
    this.commonService._selectCity.set(city);
    this.selectedCity = this.commonService._selectCity();
    this.router.navigate(['explore', 'home', city]);
    sessionStorage.setItem('selectedCity', JSON.stringify(this.selectedCity));
    if (modalRef) {
      modalRef.close();
    }
  }
  /**
   * @description Logout user and clear token from storage
   * @author Gurmeet Kumar
   * @return void
   */
  logout(): void {
    if (this.authService.getUserRole()) {
      this.authService.logout();
      this.toastr.success('logut SuccessFull')
    }
  }

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
      error: (res) => {
        this.toastr.error(res.error);
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

  onClickCategory(category: string) {
    this.commonService.setCategory(category)
    this.selectedCategory = this.commonService._selectedCategory()
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


}