import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class VenuesService {

  constructor(private http: HttpClient) { }

  baseUrl = environment.baseUrl

  createVenueService(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/venues/create`, payload)
  }
  getVenues(city: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/venues/city/${city}`)
  }

  getAllVenues():Observable<any>{
    return this.http.get(`${this.baseUrl}/venues/getAll`)
  }

   getVenuesTest(): Observable<any> {
    return this.http.get(`http://localhost:3000/venues`)
  }

  deleteVenueById(id:string):Observable<any>{
    return this.http.patch(`${this.baseUrl}/venues/delete/${id}`,{})
  }

}
