import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-filter-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-accordion.component.html',
  styleUrl: './filter-accordion.component.scss',
})
export class FilterAccordionComponent {
  filterShowButtons: boolean = false;


  toggleAccoridan(): void {
    this.filterShowButtons = !this.filterShowButtons
  }

}
