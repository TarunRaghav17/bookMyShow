import { Component } from '@angular/core';

@Component({
  selector: 'app-booking-events',
  standalone: false,
  templateUrl: './booking-events.component.html',
  styleUrl: './booking-events.component.scss'
})
export class BookingEventsComponent {
  money: number = 300;
  totalMoney: number = 0;
  value: number = 1;
  add: boolean = false;

  addMamber() {
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

}
