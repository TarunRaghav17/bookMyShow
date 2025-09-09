import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalOptions,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { UserAuthComponent } from '../../../auth/user-auth/user-auth.component';
import { CommonService } from '../../../services/common.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../../../auth/auth-service.service';
import { ToastrService } from 'ngx-toastr';
export class NgbdModalContent {
  activeModal = inject(NgbActiveModal);
}
@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @ViewChild('cityModal', { static: true }) content!: TemplateRef<any>;
  cityData: any[] = [];
  citiesJson: any = null;
  showCities = false;
  selectedCity: any;
  searchText: string = '';
  city = false;
  filteredCities: any[] = [];
  viewCitiesText: string = 'View All Cities';
  showProfileheader: any;
public selectedCategory:string
  constructor(
    private modalService: NgbModal,
    public commonService: CommonService,
    public authService: AuthService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService

  ) {

        this.selectedCategory =this.commonService._selectedCategory()
    this.selectedCity = this.commonService._selectCity()
  }

  ngOnInit(): void {
    this.getAllPopularCity()
    this.getAllCitiesData()
    this.showProfileheader = this.commonService._profileHeader()
    if (!this.selectedCity) {
      this.openCityModal(this.content)
    }
  }
  /**
    * @description open cityModal  
    * @author Gurmeet Kumar
    */

  openCityModal(content: TemplateRef<any>) {
    this.modalService.open(content, {
      modalDialogClass: 'dialog',
      ariaLabelledBy: 'modal-basic-title',
    });
  }




  /**
    * @description view all city toggleButton and change the viewAllCity  
    * @author Gurmeet Kumar
    */
  viewAllCities() {
    this.showCities = !this.showCities;
    this.viewCitiesText = this.showCities ? 'Hide All Cities' : 'View All Cities';
  }


  /**
    * @description Get all popularCity  
    * @author Gurmeet Kumar
    *  @return PopularCity
    */
  getAllPopularCity() {
    this.commonService.getPopularCities().subscribe({
      next: (res) => {
        this.cityData = res;
      },
      error: (res) => {
        this.toastr.error(res.error);
      }
    });
  }


  /**
   * @description open loginModal 
   * @author Gurmeet Kumar,
   */
  openLoginModal(): void {
    const modalOptions: NgbModalOptions = {
      centered: true,
    };
    const modalRef = this.modalService.open(UserAuthComponent, modalOptions);
    modalRef.result.then(() => {
    }, () => {
    });
  }

  /**
      * @description SelectCity city and close the Modal after selectedCity, Save sessionStorage seletedCity 
      * @author Gurmeet Kumar
      */
  selectCity(city: any, modalRef: NgbModalRef) {
    this.commonService._selectCity.set(city)
    this.selectedCity = this.commonService._selectCity()
    sessionStorage.setItem('selectedCity', JSON.stringify(this.selectedCity))
    if (modalRef) {
      modalRef.close()
    }
  }



  /**
    * @description bs64imageConvertr  using this fun  
    * @author Gurmeet Kumar
    */
  getImageFromBase64(base64string: string): any {
    if (base64string) {
      let imageType = base64string;
      const fullBase64String = `data:${imageType};base64,${base64string}`;
      return this.sanitizer.bypassSecurityTrustUrl(fullBase64String);
    }
  }

  /**
     * @description logout user/admin to remove The localStorage token
     * @author Gurmeet Kumar
     */
  logout() {
    this.authService.logout()
  }

  /**
      * @description get all citiesData  list 
      * @author Gurmeet Kumar,
      * @return cities List
      */
  getAllCitiesData() {
    this.commonService.getAllCities().subscribe({
      next: (res) => {
        this.citiesJson = res
      },
      error: (res) => {
        this.toastr.error(res.error);
      }
    });

  }

  /**
      * @description onSearch by city filtered show list 
      * @author Gurmeet Kumar
      */

  onSearchChange(value: string) {
    const searchValue = value.toLowerCase();
    this.filteredCities = this.citiesJson.filter((city: any) =>
      city.name.toLowerCase().includes(searchValue)
    );
  }

  /**
    * @description input clear ,remove all text in input 
    * @author Gurmeet Kumar
    */
  clearSearch() {
    this.searchText = '';
    this.filteredCities = [];
  }
 
   onClickCategory(category:string){
    this.commonService.setCategory(category)
     this.selectedCategory =this.commonService._selectedCategory()
   }

}
