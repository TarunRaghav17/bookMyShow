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
  constructor(
    private modalService: NgbModal,
    public commonService: CommonService,
    public authService: AuthService,
    private sanitizer: DomSanitizer
  ) {

    this.selectedCity = this.commonService._selectCity()
  }

  ngOnInit(): void {
    this.getAllPopularCity()
    this.searchCityData()
    this.showProfileheader = this.commonService._profileHeader()
    if (!this.selectedCity) {
      this.openCityModal(this.content)
    }

  }

  openCityModal(content: TemplateRef<any>) {
    this.modalService.open(content, {
      modalDialogClass: 'dialog',
      ariaLabelledBy: 'modal-basic-title',
    });
  }

  viewAllCities() {
    this.showCities = !this.showCities;
    this.viewCitiesText = this.showCities ? 'Hide All Cities' : 'View All Cities';
  }

  getAllPopularCity() {
    this.commonService.getPopularCities().subscribe((res) => {
      this.cityData = res;
    })
  }



  openLoginModal(): void {
    const modalOptions: NgbModalOptions = {
      centered: true,
    };
    const modalRef = this.modalService.open(UserAuthComponent, modalOptions);
    modalRef.result.then(() => {
    }, () => {
    });
  }


  selectCity(city: any, modalRef: NgbModalRef) {
    this.commonService._selectCity.set(city)
    this.selectedCity = this.commonService._selectCity()
    sessionStorage.setItem('selectedCity', JSON.stringify(this.selectedCity))
    if (modalRef) {
      modalRef.close()
    }
  }

  editProfile() {

  }
  // Formating image
  getImageFromBase64(base64string: string): any {
    if (base64string) {
      let imageType = base64string;
      const fullBase64String = `data:${imageType};base64,${base64string}`;
      return this.sanitizer.bypassSecurityTrustUrl(fullBase64String);
    }
  }

  logout() {
    this.authService.logout()
  }



  searchCityData() {
    this.commonService.getAllCities().subscribe((res) => {
      this.citiesJson = res
    })

  }
  onSearchChange(value: string) {
    const searchValue = value.toLowerCase();
    this.filteredCities = this.citiesJson.filter((city: any) =>
      city.name.toLowerCase().includes(searchValue)
    );
  }
  clearSearch() {
    this.searchText = '';
    this.filteredCities = [];
  }

}
