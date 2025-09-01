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

  baseUrl = environment.baseUrl

  getAllCities(): Observable<any> {
    return this.http.get(`http://172.31.252.101:8080/bookmyshow/city/all`)
  }
  getPopularCities(): Observable<any> {
    return this.http.get(`http://172.31.252.101:8080/bookmyshow/city/popular`)
  }


}
