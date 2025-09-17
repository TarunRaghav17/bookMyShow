import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaysService {

  constructor(private http: HttpClient) { }
  base_url = 'http://172.31.252.101:8080/bookmyshow'


  getAllPlays(body: any): Observable<any> {
    return this.http.post(`${this.base_url}/api/events/filter`, body)
  }

  getFilters(target: any): Observable<any> {
    let Target = target.split('_').join('-')
    return this.http.get(`${this.base_url}/api/events/${Target}?eventType=Plays`)

  }
}
