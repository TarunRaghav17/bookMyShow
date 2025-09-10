import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
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

  ngOnInit(): void {


  }
  ngOnChanges(changes: SimpleChanges) {
  if (changes['filters']) {
    console.log('Current value:', changes['filters'].currentValue);
    this.filtersArray = [];

    this.filters.map((filter: any) => {
      let { data, type } = filter;
      let filteredData;

      switch (type) {
        case 'Language':
          filteredData = data.map((i: any) => ({ ...i,  text: i.languageName , selected:false }));
          break;

        case 'Formats':
          filteredData = data.map((i: any) => ({ ...i,  text: i.formatName , selected:false }));
          break;

        case 'Genres':
          filteredData = data.map((i: any) => ({ ...i,  text: i.genresName , selected:false }));
          break;

        default:
          filteredData = data;
      }
      this.filtersArray.push({ type, data: filteredData });
    });
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



