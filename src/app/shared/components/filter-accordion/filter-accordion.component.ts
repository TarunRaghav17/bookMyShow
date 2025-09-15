import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
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
  @Input() filters: any = []
  @Output() filterEvent = new EventEmitter<string>()
  filterShowButtons: boolean = true;
  selectedCategory: any;
  browseBy: any
  openedIndex: number[] = [0];
  filtersArray: any[] = []

  constructor(public router: Router, public commonService: CommonService) {
    this.selectedCategory = this.commonService._selectedCategory();
    this.browseBy = this.commonService._selectedCategory() === 'Movies' ? 'Cinemas' : 'Venues';
  }

  ngOnChanges(changes: SimpleChanges) {
  if (changes['filters']) {
    this.filtersArray=this.commonService.formatFilters(this.filters)
    } 
}

  handleNavigate() {
    let newUrl = `/${this.commonService._selectCity()}/cinemas`
    this.router.navigate([newUrl])
  }

  toggleAccordion(index: number): void {
    this.openedIndex.includes(index) ? this.openedIndex = this.openedIndex.filter((item: any) => item != index) : this.openedIndex.push(index);
  }

  applyFilter(filter: any) {
    this.filterEvent.emit(filter)
  }
}



