import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(private http: HttpClient) { }
  city = sessionStorage.getItem("selectedCity");
  _selectCity = signal<any>(this.city ? JSON.parse(this.city) : null);
  _profileHeader = signal<any>(false);
  searchSubject = new Subject<string>();
  _selectedCategory = signal<any>('');

  baseUrl = environment.baseUrl

  getAllCities(): Observable<any> {
    return this.http.get(`${this.baseUrl}/city/all`)
  }
  getPopularCities(): Observable<any> {
    return this.http.get(`${this.baseUrl}/city/popular`)
  }
  // getAllVenues(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/venue/getAll`)
  // }

}
