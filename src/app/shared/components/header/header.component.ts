import {
  Component,
  computed,
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
import { cities, citiesJson } from '../../../../../db';
import { UserAuthComponent } from '../../../auth/user-auth/user-auth.component';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
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
  @ViewChild('content', { static: true }) content!: TemplateRef<any>;
  cityData: any[] = [];
  citiesJson: any = null;
  showCities = false;
  selectedCity: any;
  city = false;
  viewCitiesText: string = 'View All Cities';
  showProfileheader: any;
  constructor(private modalService: NgbModal, public service: CommonService, private route: Router) {

    this.cityData = cities;
    this.selectedCity = this.service._selectCity()
  }

  ngOnInit(): void {
    // Open modal Without City Selected 
    this.showProfileheader = this.service._profileHeader()
    if (!this.selectedCity) {
      this.open(this.content)
    }

  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, {
      modalDialogClass: 'dialog',
      ariaLabelledBy: 'modal-basic-title',
    });

  }

  viewAllCities() {
    this.showCities = !this.showCities;
    this.viewCitiesText = this.showCities ? 'Hide All Cities' : 'View All Cities';
    this.citiesJson = this.showCities ? citiesJson : null;
  }



  openLoginModal(): void {
    const modalOptions: NgbModalOptions = {
      centered: true,
    };
    const modalRef = this.modalService.open(UserAuthComponent, modalOptions);
    modalRef.result.then((result) => {
      console.log('Modal closed with result:', result);
    }, (reason) => {
      console.log('Modal dismissed with reason:', reason);
    });
  }


  selectCity(city: any, modalRef: NgbModalRef) {
    this.service._selectCity.set(city)
    this.selectedCity = this.service._selectCity()
    sessionStorage.setItem('selectedCity', JSON.stringify(this.selectedCity))
    if (modalRef) {
      modalRef.close()
    }
  }



  editProfile() {

  }



}
