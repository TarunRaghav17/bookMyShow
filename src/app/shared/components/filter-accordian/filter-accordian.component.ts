import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-filter-accordian',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-accordian.component.html',
  styleUrl: './filter-accordian.component.scss',
})
export class FilterAccordianComponent {
  filterShowButtons: boolean = false;


  toggleAccoridan(): void {
    this.filterShowButtons = !this.filterShowButtons
  }

}
