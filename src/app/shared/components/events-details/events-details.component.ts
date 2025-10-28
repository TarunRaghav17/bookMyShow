import { Component, HostListener, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalOptions, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivitiesRoutingModule } from "../../../modules/explore/activities/activities-routing.module";
import { NumberFormatPipe } from '../../../core/pipes/number-format.pipe';
import { UserAuthComponent } from '../../../auth/user-auth/user-auth.component';
import { AuthService } from '../../../auth/auth-service.service';
import { Location } from '@angular/common';
import { DurationPipe } from '../../../core/pipes/duration.pipe';
@Component({
  selector: 'app-events-details',
  standalone: true,
  templateUrl: './events-details.component.html',
  styleUrl: './events-details.component.scss',
  imports: [ActivitiesRoutingModule, NgbModule, NumberFormatPipe, DurationPipe]
})
export class EventsDetailsComponent implements OnInit {
  id: any;
  eventDetails: any | null = null;
  showHeader: boolean = false;
  allShows: any
  today!: Date
  constructor(private route: ActivatedRoute, private router: Router, public commonService: CommonService, private toastr: ToastrService, private modalService: NgbModal, public authService: AuthService, private location: Location) {
  }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.commonService.getEventDetailsById(this.id).subscribe({
          next: (res: any) => {
            this.eventDetails = res.data
            this.commonService._selectedCategory.set(this.eventDetails.eventType)
          },
          error: (err) => {
            this.toastr.error(err.message)
          }
        })
      }
    });

  }
  @HostListener('window:scroll')
  onScroll() {
    const section = document.getElementsByClassName('description_movie_section');
    if (!section.length) return;
    this.showHeader = window.scrollY >= (section[0] as HTMLElement).offsetTop;
  }

  /**
  * @description open service modal 
  * @author  Manu shukla
  */

  openCityModal(serviceModal: TemplateRef<any>) {
    this.modalService.open(serviceModal, {
      ariaLabelledBy: 'modal-basic-title',
      modalDialogClass: 'term-and-condition',
      backdrop: 'static'
    });
  }
  closemodal() {
    this.modalService.dismissAll();
  }
  /**
    * @description open service modal 
    * @author Manu Shukla
    */
  openShareModal(serviceModal: TemplateRef<any>) {
    this.modalService.open(serviceModal, {
      ariaLabelledBy: 'modal-basic-title',
      modalDialogClass: 'share-modal',
      backdrop: 'static'
    });
  }

  getCurrentPath() {
    let url = window.location.href;
    this.copyLink(url);
  }

  /**
    * @description method for copy the current URL
    * @author Manu Shukla
    */
  copyLink(link: string) {
    const textarea = document.createElement('textarea');
    textarea.value = link;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        this.toastr.success("Link copied successfully");
        this.closemodal();
      } else {
        this.toastr.error("Copy command was unsuccessful");
      }
    } catch (err) {
      this.toastr.error("Failed to copy");
    }
    document.body.removeChild(textarea);
  }

  /**
    * @description Opens a confirmation modal before deleting an event.  
    * @author Manu Shukla
    */
  handleDeleteEvent(confirmDeleteModal: TemplateRef<any>) {
    const modalRef = this.modalService.open(confirmDeleteModal, {
      ariaLabelledBy: 'modal-basic-title',
      modalDialogClass: 'no-border-modal',
      backdrop: 'static',
    });

    modalRef.result
      .then((result) => {
        if (result === 'confirm') {
          this.commonService.deleteContentById(this.eventDetails.eventId).subscribe({
            next: (res) => {
              this.toastr.success(res.message);
              this.location.back();
            },
            error: (err) => {
              this.toastr.error(err.error.message);
            },
          });
        }
      })
      .catch(() => { });
  }

  /**
    * @description get Today Date in format of yeaar-month-date  
    * @author Manu Shukla
    */
  getToday() {
    const today = new Date();
    const year = today.getUTCFullYear();
    const month = String(today.getUTCMonth() + 1).padStart(2, '0');
    const day = String(today.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
    * @description Opens a confirmation modal before Booking an event.  
    * @author Manu Shukla
    */
  openConfirmModal(confirmModal: TemplateRef<any>) {
    const token = localStorage.getItem('token');
    if (!token) {
      const modalRef = this.modalService.open(confirmModal, {
        ariaLabelledBy: 'modal-basic-title',
        modalDialogClass: 'no-border-modal',
        backdrop: 'static'
      });
      modalRef.result.then((result) => {
        if (result === 'login') {
          const modalOptions: NgbModalOptions = { centered: true };
          this.modalService.open(UserAuthComponent, modalOptions);
        }
      }).catch(() => { });
      return;
    }
    this.router.navigate([
      '/book-events',
      this.commonService._selectedCategory(),
      this.eventDetails.name.split(' ').join('-'),
      this.eventDetails.eventId,
      this.eventDetails.startDate,
    ]);
  }

  /**
    * @description Opens a modal if event is Closed  
    * @author Manu Shukla
    */
  eventClosed(closedModal: TemplateRef<any>) {
    this.modalService.open(closedModal, {
      ariaLabelledBy: 'modal-basic-title',
      modalDialogClass: 'no-border-modal',
      backdrop: 'static',
    });
  }
}