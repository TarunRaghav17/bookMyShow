import { Component, HostListener, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, Location } from '@angular/common';
import { MovieDetailsLoadingSkeltonComponent } from '../movie-details-loading-skelton/movie-details-loading-skelton.component';
import { NumberFormatPipe } from '../../../core/pipes/number-format.pipe';
import { AuthService } from '../../../auth/auth-service.service';
import { Title } from '@angular/platform-browser';
import { DurationPipe } from '../../../core/pipes/duration.pipe';
@Component({
  selector: 'app-movies-details',
  imports: [NgbModule, CommonModule, MovieDetailsLoadingSkeltonComponent, NumberFormatPipe,DurationPipe],
  templateUrl: './movies-details.component.html',
  styleUrl: './movies-details.component.scss'
})
export class MoviesDetailsComponent {

loggedInUserId:string | null=null

  constructor(private modalService: NgbModal, public commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToastrService,
    public authService: AuthService,
    private location: Location,
    private titleService: Title,
  ) { }
  private modalRef?: NgbModalRef | null = null

  movieDetails: any | null = null
  ngOnInit() {
    this.fetchContentIdByUrl();
    this.loggedInUserId = this.authService.userDetailsSignal().userId

  }
  showHeader = false;
  @HostListener('window:scroll')
  onScroll() {
    const section = document.getElementsByClassName('description_movie_section');
    if (!section.length) return;
    this.showHeader = window.scrollY >= (section[0] as HTMLElement).offsetTop;
  }

  open(content: TemplateRef<any>) {
    this.modalRef = this.modalService.open(content, {
      modalDialogClass: 'book-ticekt-dialog',
      ariaLabelledBy: 'modal-basic-title',
      centered: true
    });
  }

  close() {
    if (this.modalRef) {
      this.modalRef.close()
      this.modalRef = null
    }
  }

  navigateToBuyTicket(payload: any) {
    this.commonService.setUserLangFormat(payload);

    this.modalRef?.close()
    this.router.navigate(
      [`/movies/${this.commonService._selectCity()?.toLowerCase()}/${this.movieDetails.name.toLowerCase().split(' ').join('-')}/buytickets/${this.movieDetails.eventId}`],
      {
        state: payload
      })
  }

  fetchContentIdByUrl() {
    let contentId: string | null = this.route.snapshot.paramMap.get('id')
    this.commonService.getContentDetailsById(contentId).subscribe({
      next: (res) => {
        this.movieDetails = res.data;
        this.titleService.setTitle(this.movieDetails.name)
      },
      error: (err) => {
        this.toaster.error(err.error.message)
      }
    })
  }

  handleUserLikedContents(content: any) {
    if (this.authService.getUserFromToken()) this.commonService.setUserLikedContents(content)

    else {
      this.toaster.error('You must Login to Like this Content')
    }
  }


  handleDeleteEvent(confirmDeleteModal: TemplateRef<any>) {
    const modalRef = this.modalService.open(confirmDeleteModal, {
      ariaLabelledBy: 'modal-basic-title',
      modalDialogClass: 'no-border-modal',
      backdrop: 'static',
    });

    modalRef.result
      .then((result) => {
        if (result === 'confirm') {
          this.commonService.deleteContentById(this.movieDetails.eventId,this.loggedInUserId).subscribe({
            next: (res) => {
              this.toaster.success(res.message);
              this.location.back()
            },
            error: (err) => {
              this.toaster.error(err.error.message)
            }
          })
        }
      })
      .catch(() => { });
  }
  openShareModal(serviceModal: TemplateRef<any>) {
    this.modalService.open(serviceModal, {
      ariaLabelledBy: 'modal-basic-title',
      modalDialogClass: 'share-modal',
    });
  }
  closemodal() {
    this.modalService.dismissAll();
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
        this.toaster.success("Link copied successfully");
        this.closemodal();
      } else {
        this.toaster.error("Copy command was unsuccessful");
      }
    } catch (err) {
      this.toaster.error("Failed to copy");
    }
    document.body.removeChild(textarea);
  }
}
