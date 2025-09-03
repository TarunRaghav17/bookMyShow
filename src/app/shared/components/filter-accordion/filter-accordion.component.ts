import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-filter-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-accordion.component.html',
  styleUrl: './filter-accordion.component.scss',
})
export class FilterAccordionComponent {

  selectedCategory: any;
  browseBy: any
  constructor(public router: Router, public commonService: CommonService) {
    this.selectedCategory = this.commonService._selectedCategory();
    this.browseBy = this.commonService._selectedCategory() === 'Movies' ? 'Cinemas' : 'Venues';
  }

  @Output() filterEvent = new EventEmitter<string>()
  filters = [
    {
      type: "Language",
      data: ['Hindi', 'English', 'Gujrati', 'Marathi', 'Malayalam', 'Punjabi', 'Telugu']
    },
    {
      type: "Genres",
      data: ['Drama', 'Action', 'Comedy', 'Thriller']
    },
    {
      type: "Formats",
      data: ['2D', '3D', '4Dx', 'IMAX2d']
    },
  ]
  filterShowButtons: boolean = false;

  openedIndex: number[] = [0];

  toggleAccordion(index: number): void {
    this.openedIndex.includes(index) ? this.openedIndex = this.openedIndex.filter((item: any) => item != index) : this.openedIndex.push(index);
  }

  applyFilter(filter: string) {
    this.filterEvent.emit(filter)
  }

  handleNavigate() {
    let newUrl = `/${this.commonService._selectCity()}/cinemas`
    this.router.navigate([newUrl])
  }






}


