import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
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
  originalVenueListArray: any[] = []; 
  selectedType: string = ''; 

  constructor(public commonService: CommonService ,  private toastr: ToastrService) {
    this.selectedCategory = this.commonService._selectedCategory();
    this.browseBy = this.commonService._selectedCategory() === 'Movie' ? 'Cinemas in' : 'Venues For';
    this.selecetedCity = this.commonService._selectCity();

  }
 ngOnInit(): void {
   this.getVenues()
 }

  onVenueSearch(event: any) {
    const searchText = event.target.value.toLowerCase();
   if (searchText) {
    this.venueListArray = this.originalVenueListArray.filter(cinema =>
      cinema.venueName.toLowerCase().includes(searchText) || cinema.address.street.toLowerCase().includes(searchText)
    );
  } else {
    this.venueListArray = [...this.originalVenueListArray]; 
  }
}

  toggleBtn() {
    this.toggleButton = !this.toggleButton
  }

  getVenues(){
    debugger
    this.commonService.getAllVenuesBYcity(this.commonService._selectCity()).subscribe({
      next:(res)=>{
        this.originalVenueListArray = res.filter((venue:any)=>venue.venueType == this.commonService._selectedCategory())
         this.venueListArray = [...this.originalVenueListArray]; 
      },
      error:(err)=>{
        this.toastr.error(err.message)
      }
    })
  }

setType(type: string) {
   this.commonService._selectedCategory.set(type);
  this.selectedType = type;
  this.getVenues()
  this.toggleButton = false;
}
}



