import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  city = sessionStorage.getItem("selectedCity");
  _selectCity = signal<any>(this.city ? JSON.parse(this.city) : null);
  _selectedCategory=signal<string>('')
  _profileHeader = signal<any>(false)

  constructor() {
  }



}
