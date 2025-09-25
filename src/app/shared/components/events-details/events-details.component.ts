import { Component, HostListener, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivitiesRoutingModule } from "../../../modules/explore/activities/activities-routing.module";
@Component({
  selector: 'app-events-details',
  standalone: true,
  templateUrl: './events-details.component.html',
  styleUrl: './events-details.component.scss',
  imports: [ActivitiesRoutingModule, NgbModule]
})
export class EventsDetailsComponent implements OnInit {
  id: any;
  eventDetails: any | null = null;
  showHeader: boolean = false;
  constructor(private route: ActivatedRoute, public commonService: CommonService, private toastr: ToastrService, private modalService: NgbModal) { }


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
    navigator.clipboard.writeText(link).then(() => {
      this.toastr.success("Link copied sucessfully")
      this.closemodal()
    }).catch(() => {
      this.toastr.error('Failed to copy');
    });
  }
}
