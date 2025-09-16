import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VenueService {
  constructor(private http:HttpClient) { }

  createVenueService(payload:any):Observable<any>{ 
    return this.http.post('http://localhost:3002/venues',payload)
  }

  getVenues():Observable<any>{
    return this.http.get('http://localhost:3002/venues')
  } }

