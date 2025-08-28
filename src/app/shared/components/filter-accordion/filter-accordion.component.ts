import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-accordion.component.html',
  styleUrl: './filter-accordion.component.scss',
})
export class FilterAccordionComponent {

  @Output() filterEvent = new EventEmitter<string>()
@Input() filters:any =[]
  filterShowButtons: boolean = false;
  filterText: any[] = ['Hindi', 'English', 'Gujrati', 'Marathi', 'Malayalam', 'Punjabi', 'Telugu']


  openedIndex: number[] = [0];

  toggleAccordion(index: number): void {
    this.openedIndex.includes(index) ? this.openedIndex = this.openedIndex.filter((item: any) => item != index) : this.openedIndex.push(index);

  }


  applyFilter(filter: any) {
    this.filterEvent.emit(filter)

  }
}

// api/getFilters/movies

// [
// movies:{
//   "languages": [
//     "Hindi",
//     "English",
//     "Punjabi",
//     "Tamil",
//     "Telugu"
//   ],
//   "genres": [
//     "Action",
//     "Comedy",
//     "Drama",
//     "Thriller",
//     "Horror",
//     "Romance"
//   ],
//   "formats": [
//     "2D",
//     "3D",
//     "IMAX"
//   ],
//   "releaseDates": [
//     "2025-08-20",
//     "2025-08-21",
//     "2025-08-22"
//   ],
//   "locations": [
//     "Delhi",
//     "Mumbai",
//     "Bangalore",
//     "Hyderabad"
//   ],
//   "ratings": [1, 2, 3, 4, 5],
//   "priceRange": {
//     "min": 100,
//     "max": 1000
//   },
//   "ageRatings": ["U", "UA", "A"]
// },
// events:{
//   "languages": [
//     "Hindi",
//     "English",
//     "Punjabi",
//     "Tamil",
//     "Telugu"
//   ],
//   "genres": [
//     "Action",
//     "Comedy",
//     "Drama",
//     "Thriller",
//     "Horror",
//     "Romance"
//   ],
//   "formats": [
//     "2D",
//     "3D",
//     "IMAX"
//   ],
//   "releaseDates": [
//     "2025-08-20",
//     "2025-08-21",
//     "2025-08-22"
//   ],
//   "locations": [
//     "Delhi",
//     "Mumbai",
//     "Bangalore",
//     "Hyderabad"
//   ],
//   "ratings": [1, 2, 3, 4, 5],
//   "priceRange": {
//     "min": 100,
//     "max": 1000
//   },
//   "ageRatings": ["U", "UA", "A"]
// }
// ]