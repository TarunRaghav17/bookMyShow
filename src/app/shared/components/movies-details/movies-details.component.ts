import { Component, HostListener, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-movies-details',
  imports: [NgbModule],
  templateUrl: './movies-details.component.html',
  styleUrl: './movies-details.component.scss'
})
export class MoviesDetailsComponent {
  constructor(private modalService: NgbModal, public commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToastrService
  ) { }
  private modalRef?: NgbModalRef | null = null

  movieDetails: any = {}

  langFormatData: any = [
    {
      lang: 'TAMIL',
      format: ['2D', '4DX', 'IMAX 2D', 'ICE']
    },
    {
      lang: 'ENGLISH',
      format: ['2D', '4DX', 'IMAX 2D', 'ICE']

    },
    {
      lang: 'HINDI',
      format: ['2D', '4DX', 'IMAX 2D', 'ICE']
    }
  ]
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

  navigateToBuyTicket() {
    this.modalRef?.close()
    this.router.navigate([`/movies/${this.commonService._selectCity()?.toLowerCase()}/war2/buytickets/123`])
  }

  fetchContentIdByUrl() {
    let contentId: string | null = this.route.snapshot.paramMap.get('id')
    this.commonService.getContentDetailsById(contentId).subscribe({
      next: (res) => {
        this.movieDetails = res.data
      },
      error: () => {
        this.toaster.error('Something went wrong')
      }
    })
  }

}
