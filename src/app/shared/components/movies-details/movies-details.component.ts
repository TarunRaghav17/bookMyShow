import { Component, HostListener, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, Location } from '@angular/common';
import { MovieDetailsLoadingSkeltonComponent } from '../movie-details-loading-skelton/movie-details-loading-skelton.component';
import { NumberFormatPipe } from '../../../core/pipes/number-format.pipe';
import { AuthService } from '../../../auth/auth-service.service';
@Component({
  selector: 'app-movies-details',
  imports: [NgbModule, CommonModule, MovieDetailsLoadingSkeltonComponent, NumberFormatPipe],
  templateUrl: './movies-details.component.html',
  styleUrl: './movies-details.component.scss'
})
export class MoviesDetailsComponent {
  constructor(private modalService: NgbModal, public commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToastrService,
    public authService: AuthService,
    private location: Location
  ) { }
  private modalRef?: NgbModalRef | null = null

  movieDetails: any | null = null
  ngOnInit() {
    this.fetchContentIdByUrl()
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
        this.movieDetails = res.data
      },
      error: (err) => {
        this.toaster.error(err.error.message)
      }
    })
  }

  handleDeleteEvent() {
    let confirm = window.confirm('Are you sure to delete this event?')
    if (confirm) {
      this.commonService.deleteContentById(this.movieDetails.eventId).subscribe({
        next: (res) => {
          this.toaster.success(res.message);
          this.location.back()
        },
        error: (err) => {
          this.toaster.error(err.error.message)
        }
      })

    }
  }

}
