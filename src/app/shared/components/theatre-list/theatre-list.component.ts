import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { cinemas } from '../../../../../db';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-theatre-list',
  standalone: false,
  templateUrl: './theatre-list.component.html',
  styleUrl: './theatre-list.component.scss'
})
export class TheatreListComponent implements OnInit{
  cinemaData: any[] = []
  selectedCategory: any;
  browseBy: string;
  selecetedCity: any;
  toggleButton: boolean = false
  venueListArray:any[] = []

  constructor(public commonService: CommonService ,  private toastr: ToastrService) {
    this.selectedCategory = this.commonService._selectedCategory();
    this.browseBy = this.commonService._selectedCategory() === 'Movies' ? 'Cinemas in' : 'Venues For';
    this.selecetedCity = this.commonService._selectCity();
    this.cinemaData = cinemas

  }
 ngOnInit(): void {
   this.getVenues()
 }

  onVenueSearch(event: any) {
  const searchText = event.target.value.toLowerCase(); 

  if (searchText) {
    const res = this.venueListArray.filter((cinema) =>
      cinema.venueName.toLowerCase().includes(searchText)
    );
    this.venueListArray = res;
  } else {
    this.getVenues(); 
  }
}

  toggleBtn() {
    this.toggleButton = !this.toggleButton
  }
  getVenues(){
    this.commonService.getAllVenuesBYcity(this.commonService._selectCity()).subscribe({
      next:(res)=>{
        this.venueListArray = res
      },
      error:(err)=>{
        this.toastr.error(err.message)
      }
    })
  }
  

}



