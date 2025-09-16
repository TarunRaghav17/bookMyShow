import { Component, HostListener, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
@Component({
  selector: 'app-movies-details',
  imports: [NgbModule],
  templateUrl: './movies-details.component.html',
  styleUrl: './movies-details.component.scss'
})
export class MoviesDetailsComponent {
  constructor(private location: Location, private modalService: NgbModal, public commonService: CommonService,
    private router: Router) { }
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
    const state = this.location.getState();
    this.movieDetails = state

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

}
