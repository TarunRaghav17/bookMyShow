import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-booking-events',
  standalone: false,
  templateUrl: './booking-events.component.html',
  styleUrl: './booking-events.component.scss'
})
export class BookingEventsComponent implements OnInit{
  money: number = 300;
  totalMoney: number = 0;
  value: number = 1;
  add: boolean = false;
  allShows:any[]=[]
  title:string|null =''
   
constructor(private commonService:CommonService , private toastr: ToastrService ,private route:ActivatedRoute){

}
  
ngOnInit(): void {
  this.title = this.route.snapshot.paramMap.get('eventname')
  this.getShows()
}

  addMember() {
    this.add = true;
    this.updateTotalMoney();
  }

  increaseCounter() {
    if (this.value < 10) {
      this.value++;
      this.updateTotalMoney();
    }
  }

  decreaseCounter() {
    if (this.value > 1) {
      this.value--;
      this.updateTotalMoney();
    }
  }

  updateTotalMoney() {
    this.totalMoney = this.value * this.money;
  }


getShows(){
  let eventId:string| null= this.route.snapshot.paramMap.get('id')
   let date:string| null= this.route.snapshot.paramMap.get('date')
    this.commonService.getShowsById(eventId,date).subscribe({
      next:(res)=>{
        this.allShows = res.data
      },
      error:(err)=>{
        this.toastr.error(err.message)
      }
    })
  }
}
