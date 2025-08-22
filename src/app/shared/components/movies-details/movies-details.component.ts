import { Component, ElementRef, HostListener, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-movies-details',
  imports: [NgbModule],
  templateUrl: './movies-details.component.html',
  styleUrl: './movies-details.component.scss'
})
export class MoviesDetailsComponent {
  constructor(private location: Location, private modalService: NgbModal) { }
  movieDetails: any = {}
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
    this.modalService.open(content, {
      modalDialogClass: 'book-ticekt-dialog',
      ariaLabelledBy: 'modal-basic-title',
      centered: true
    });

  }

}
