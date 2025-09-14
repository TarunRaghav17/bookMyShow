import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events-details',
  standalone: true,
  templateUrl: './events-details.component.html',
  styleUrl: './events-details.component.scss'
})
export class EventsDetailsComponent {

  constructor(private router: Router) { }

  showHeader = false;

  @HostListener('window:scroll')
  onScroll() {
    const section = document.getElementsByClassName('description_movie_section');
    if (!section.length) return;
    this.showHeader = window.scrollY >= (section[0] as HTMLElement).offsetTop;
  }
  navigateToDetails() {
    this.router.navigate(['plays/:plays-name/:id']);
  }
}
