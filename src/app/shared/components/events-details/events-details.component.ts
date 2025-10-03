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
@Component({
  selector: 'app-events-details',
  standalone: true,
  templateUrl: './events-details.component.html',
  styleUrl: './events-details.component.scss',
  imports: [ActivitiesRoutingModule, NgbModule, NumberFormatPipe]
})
export class EventsDetailsComponent implements OnInit {
  id: any;
  eventDetails: any | null = null;
  showHeader: boolean = false;
  allShows: any
  constructor(private route: ActivatedRoute, private router:Router,public commonService: CommonService, private toastr: ToastrService, private modalService: NgbModal , public authService:AuthService , private location:Location) {
  }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.commonService.getEventDetailsById(this.id).subscribe({
          next: (res: any) => {
            this.eventDetails = res.data
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
  * @author  Gurmeet Kumar
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

  copyLink(link: string) {
    const textarea = document.createElement('textarea');
    textarea.value = link;
    document.body.appendChild(textarea);
    textarea.focus();
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


  handleBookNow(): void {
    const token = localStorage.getItem('token'); 

    if (!token) {
      let res = confirm('Please log in to book this event.');
      if (res) {
        const modalOptions: NgbModalOptions = { centered: true };
        this.modalService.open(UserAuthComponent, modalOptions);
      }
      return;
    }

    else{
       this.router.navigate([
  '/book-events',
  this.commonService._selectedCategory(),
  this.eventDetails.name.split(' ').join('-'),
  this.eventDetails.eventId,
  this.eventDetails.startDate
]); 
    }
  }

   handleDeleteEvent() {
    let confirm = window.confirm('Are you sure to delete this event?')
    if (confirm) {
      this.commonService.deleteContentById(this.eventDetails.eventId).subscribe({
        next: (res) => {
          this.toastr.success(res.message);
          this.location.back()
        },
        error: (err) => {
          this.toastr.error(err.error.message)
        }
      })
 
    }
  }
 
}
