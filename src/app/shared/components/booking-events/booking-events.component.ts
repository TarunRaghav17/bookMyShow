import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router} from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../auth/auth-service.service';

@Component({
  selector: 'app-booking-events',
  standalone: false,
  templateUrl: './booking-events.component.html',
  styleUrl: './booking-events.component.scss'
})
export class BookingEventsComponent implements OnInit {
  
  constructor(private authService: AuthService, public commonService: CommonService, private toastr: ToastrService, private route: ActivatedRoute, private location: Location, private modalService: NgbModal , private router:Router ) {
    this.user = this.authService.getUserFromToken()
  }

  user!: any;
  money!: number
  totalMoney: number = 0;
  value: number = 1;
  add: boolean = false;
  allShows: any[] = []
  title!: string | null
  date!: string | null
  bookeSeats: any[] = []
  selectedSeats: any[] = []
  eventId: any
  selectedDate: any;
  dateSelectionArray: any[] = [];
  selectedTime: string = '';
  venueTitle:string=''
  allSelectedSeats: string[] = [];
  activeTab: 'step1' | 'step2' = 'step1';

  ngOnInit(): void {
    this.title = this.route.snapshot.paramMap.get('eventname');
    this.date = this.route.snapshot.paramMap.get('date');
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.getShows();
    this.selectedSeats = this.getSelectedSeats(this.eventId);
    this.value = this.selectedSeats.length || 1;
    this.initializeDateSelectionArray()

  }
 /**
 * @description initialize Top Filters
 * @author Manu Shukla
 * @returnType void
 */
  addMember() {
    this.add = true;
    this.updateTotalMoney();
  }

 /**
 * @description  increase counter for number of seats
 * @author Manu Shukla
 * @returnType void
 */
  increaseCounter() {
    if (this.value < 10) {
      this.value++;
      this.updateTotalMoney();
    }
  }

 /**
 * @description decrease counter for number of seats
 * @author Manu Shukla
 * @returnType void
 */
  decreaseCounter() {
    if (this.value > 1) {
      this.value--;
      this.selectedSeats.pop();
      this.setSelectedSeats(this.eventId, this.selectedSeats);
      this.updateTotalMoney();
    }
  }

/**
 * @description update total price according to number of setas
 * @author Manu Shukla
 * @returnType void
 */
  updateTotalMoney() {
    this.totalMoney = this.value * this.money;
  }

  /**
 * @description  get all shows of particular event on selected date
 * @author Manu Shukla
 * @returnType void
 */
  getShows(_selectedDate?: any) {
    this.eventId = this.route.snapshot.paramMap.get('id')
    this.date = this.commonService.getUserSelectedDate()?.today ?? this.route.snapshot.paramMap.get('date')
    this.commonService.getShowsById(this.eventId, this.date).subscribe({
      next: (res) => {
        this.allShows = res.data
          this.venueTitle = this.allShows[0]?.venueName; 
        this.money = this.allShows[0]?.shows[0]?.availableCategories[0]?.categoryPrice
      },
      error: (err) => {
        this.toastr.error(err.message)
      }
    })
  }
/**
 * @description go back to previous page
 * @author Manu Shukla
 * @returnType void
 */
  goBack() {
    this.location.back()
  }

  /**
 * @description open booking confirmation modal
 * @author Manu Shukla
 * @returnType void
 */
  bookingConfirmation(confirmModal: TemplateRef<any>) {
    const seatsToGenerate = this.value - this.selectedSeats.length;
    for (let i = 0; i < seatsToGenerate; i++) {
      this.generateRandomCode();
    }

    const modalRef = this.modalService.open(confirmModal, {
      ariaLabelledBy: 'modal-basic-title',
      modalDialogClass: 'no-border-modal',
      backdrop: 'static'
    });

    modalRef.result.then((result) => {
      if (result === 'Book') {
        let sendPayLoad = [
          {
            "userId": this?.user?.userId,
            "eventId": this.eventId,
            "venueId": this.allShows[0]?.venueId,
            "showId": this.allShows[0]?.showId,
            "date": this.selectedDate.today,
            "time": this.selectedTime,
            "eventSeats":this.selectedSeats
          }
        ]

        this.commonService.bookUserSeats(sendPayLoad).subscribe({
          next: () => {
             this.toastr.success(`ticket booked successfully for ${this.title}`)
             this.router.navigate(['/'])
             localStorage.removeItem('selectedSeatsByEvent');

          },
          error: (err) => {
            this.toastr.error(err.message);
          }
        });

      }
    })
  }

  alphabets = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
  ]

 /**
 * @description  genreate random seat with alphabet and number
 * @author Manu Shukla
 * @returnType void
 */
  generateRandomCode() {
     this.allSelectedSeats = this.getSelectedSeats(this.eventId);
    let newSeat;
    do {
      const randomLetter = this.alphabets[Math.floor(Math.random() * this.alphabets.length)];
      const randomNumber = String(Math.floor(Math.random() * 100)).padStart(2, '0');
      newSeat = `${randomLetter}${randomNumber}`;
    } while (this.selectedSeats.includes(newSeat));
    this.selectedSeats.push(newSeat);
    this.setSelectedSeats(this.eventId, this.selectedSeats);
  }

 /**
 * @description  get selected seats from Local storage 
 * @author Manu Shukla
 * @returnType string[]
 */
  getSelectedSeats(eventId: string | number): string[] {
    const allEvents: { eventId: string | number, selectedSeats: string[] }[] =
      JSON.parse(localStorage.getItem('selectedSeatsByEvent') || '[]');
    const event = allEvents.find(e => e.eventId == eventId);
    return event ? event.selectedSeats : [];
  }

  /**
 * @description save selected seats to local storage
 * @author Manu Shukla
 * @returnType string[]
 */
  setSelectedSeats(eventId: string | number, seats: string[]) {
    let allEvents: { eventId: string | number, selectedSeats: string[] }[] =
      JSON.parse(localStorage.getItem('selectedSeatsByEvent') || '[]');
    const index = allEvents.findIndex(e => e.eventId == eventId);
    if (index > -1) {
      allEvents[index].selectedSeats = seats;
    } else {
      allEvents.push({ eventId, selectedSeats: seats });
    }
    localStorage.setItem('selectedSeatsByEvent', JSON.stringify(allEvents));
  }

  setActiveTab(tab: 'step1' | 'step2') {
    this.activeTab = tab;
  }


  onDateChange(index: number, dateObj: any) {
    if (index < 6) { 
      this.selectedTime=""
      this.selectedDate = dateObj;
      this.commonService.setUserSelectedDate(dateObj);
      this.getShows();
    }
  }

/**
* @description function that initializes dateSelectionArray
* @author Manu Shukla
* @returnType void
*/
  initializeDateSelectionArray() {
    let today = new Date();
    for (let i = 0; i < 9; i++) {
      let dateObj = new Date();
      dateObj.setDate(today.getDate() + i)
      this.dateSelectionArray.push({
        day: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
        dateNum: dateObj.getDate(),
        month: dateObj.toLocaleDateString('en-US', { month: 'short' }),
        today: dateObj.toISOString().split('T')[0]
      })
    }
  }
  
}