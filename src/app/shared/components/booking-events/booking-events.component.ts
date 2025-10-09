import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-booking-events',
  standalone: false,
  templateUrl: './booking-events.component.html',
  styleUrl: './booking-events.component.scss'
})
export class BookingEventsComponent implements OnInit {
  money!: number 
  totalMoney: number = 0;
  value: number = 1;
  add: boolean = false;
  allShows: any[] = []
  title!: string | null 
  date!: string | null
   bookeSeats: any[] = []

  constructor(private commonService: CommonService, private toastr: ToastrService, private route: ActivatedRoute, private router: Router, private location: Location, private modalService: NgbModal) {

  }

  ngOnInit(): void {
    this.title = this.route.snapshot.paramMap.get('eventname')
    this.date = this.route.snapshot.paramMap.get('date')
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

  getShows() {
    let eventId: string | null = this.route.snapshot.paramMap.get('id')
    let date: string | null = this.route.snapshot.paramMap.get('date')
    this.commonService.getShowsById(eventId, date).subscribe({
      next: (res) => {
        this.allShows = res.data
        this.money = this.allShows[0]?.shows[0]?.availableCategories[0]?.categoryPrice
      },
      error: (err) => {
        this.toastr.error(err.message)
      }
    })
  }

  goBack() {
    this.location.back()
  }

  bookingConfirmation(confirmModal: TemplateRef<any>) {
    for (let i = 0; i < this.value; i++) {
      this.generateRandomCode()
    }
    const modalRef = this.modalService.open(confirmModal, {
      ariaLabelledBy: 'modal-basic-title',
      modalDialogClass: 'no-border-modal',
      backdrop: 'static'
    });
    modalRef.result.then((result) => {
      if (result === 'Book') {
        this.toastr.success(`your ticekt for ${this.title} booked successfully `)
      }
      setTimeout(() => {
        this.router.navigate(['/explore/home'])
      }, 300)

    })
  }

  alphabets = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
  ]
  generateRandomCode() {
    const randomLetter = this.alphabets[Math.floor(Math.random() * this.alphabets.length)]
    const randomNumber = String(Math.floor(Math.random() * 100)).padStart(2, '0');
    this.bookeSeats.push(`${randomLetter}-${randomNumber}`);
  }
  
}