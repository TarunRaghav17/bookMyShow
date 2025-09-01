import { Component } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { cinemas } from '../../../../../db';


@Component({
  selector: 'app-theatre-list',
  standalone: false,
  templateUrl: './theatre-list.component.html',
  styleUrl: './theatre-list.component.scss'
})
export class TheatreListComponent {
  cinemaData: any[] = []
  selectedCategory: any;
  browseBy: string;
  selecetedCity: any;
  constructor(public commonService: CommonService) {
    this.selectedCategory = this.commonService._selectedCategory();
    this.browseBy = this.commonService._selectedCategory() === 'Movies' ? 'Cinemas in' : 'Venues For';
    this.selecetedCity = this.commonService._selectCity();
    this.cinemaData = cinemas
  }
}



