import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatMap, from, Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class VenuesService {

  constructor(private http: HttpClient) { }

  baseUrl=environment.baseUrl
  createVenueService(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/venues/create`, payload)
  }

  getVenues(): Observable<any> {
    return this.http.get('http://localhost:3002/venues')
  }


  uploadBulk(items: any[]) {
    console.log(items)
    return from(items).pipe(
      concatMap(item => this.createVenueService(item)) // ensures sequential upload
    );
  }
}
