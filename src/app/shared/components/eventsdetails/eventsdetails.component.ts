import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-eventsdetails',
  standalone: true,
  templateUrl: './eventsdetails.component.html',
  styleUrl: './eventsdetails.component.scss'
})
export class EventsdetailsComponent {

  showHeader = false;

  @HostListener('window:scroll')
  onScroll() {
    const section = document.getElementsByClassName('description_movie_section');
    if (!section.length) return;
    this.showHeader = window.scrollY >= (section[0] as HTMLElement).offsetTop;
  }

}
