import { Component } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-error-page',
  standalone: false,
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss'
})
export class ErrorPageComponent {
  constructor(private location: Location) { } goBack() {
    this.location.back();
  }
}