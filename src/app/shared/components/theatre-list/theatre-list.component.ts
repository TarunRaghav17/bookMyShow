import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';


@Component({
  selector: 'app-theatre-list',
  standalone: false,
  templateUrl: './theatre-list.component.html',
  styleUrl: './theatre-list.component.scss'
})
export class TheatreListComponent implements OnInit {

  ngOnInit(): void {
    this.getAllVenuesData()
  }

  // selectedCity: any
  cinemaData: any[] = []

  constructor(public commonService: CommonService) {
  }
  // this.selectedCity = this.commonService._selectCity()

  getAllVenuesData() {
    this.commonService.getAllVenues().subscribe((res) => {
      this.cinemaData = res
    })
  }


}



