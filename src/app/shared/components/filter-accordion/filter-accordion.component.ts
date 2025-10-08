import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
@Component({
  selector: 'app-filter-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-accordion.component.html',
  styleUrl: './filter-accordion.component.scss',
})
export class FilterAccordionComponent implements OnInit {
  @Output() filterEvent = new EventEmitter<string>()
  @Output() clearFilterEvent = new EventEmitter<string>()
  filterShowButtons: boolean = true;
  selectedCategory: any;
  browseBy: any
  openedIndex: number[] = [0];
  filtersArray: any[] = []
  dummyMoviesdata!: any[];

  constructor(public router: Router, public commonService: CommonService) {
    this.selectedCategory = this.commonService._selectedCategory();
    this.browseBy = this.commonService._selectedCategory() === 'Movies' ? 'Cinemas' : 'Venues';
  }

  ngOnInit(): void {
    this.filtersArray = this.commonService.filtersSignal()
  }

  handleNavigate() {
    let newUrl = `/${this.commonService._selectCity()}/cinemas`
    this.router.navigate([newUrl])
  }

/**
  * @description Toggles the visibility state of a specific accordion section based on its index.  
  * @param {number} index - The index of the accordion section to toggle.
  * @author Manu Shukla
  */
  toggleAccordion(index: number): void {
    this.openedIndex.includes(index) ? this.openedIndex = this.openedIndex.filter((item: any) => item != index) : this.openedIndex.push(index);
  }

/**
  * @description Emits the selected filter object to notify parent components  
  * @param {any} filter - The filter object containing the selected filter criteria.
  * @author Manu Shukla
  */
  applyFilter(filter: any) {
    this.filterEvent.emit(filter)
  }
 
  /**
  * @description Emits the selected filter object to notify parent components  
  * @param {any} filter - The filter object containing the selected filter criteria.
  * @author Manu Shukla
  */
  clearAllFilters(item: any, index: number, type: string = ''): void {
    let { selectedType, data } = item;
    const hasSelected = data.some((i: any) => i.selected);
    if (!hasSelected) {
      return;
    }
    data.forEach((i: any) => (i.selected = false));
    this.commonService.clearSelectedFilterByType(selectedType);
    this.toggleAccordion(index);
    if (type) {
      this.clearFilterEvent.emit(type);
    }
     if (!this.openedIndex.includes(0)) {
    this.openedIndex.push(0);
  }
  }

}
