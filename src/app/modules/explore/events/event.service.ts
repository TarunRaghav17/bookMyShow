import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http:HttpClient) { }

   base_url = 'http://172.31.252.101:8080/bookmyshow'

   getAllEvents():Observable<any>{
    return this.http.post(`${this.base_url}/api/events/filter`,{
      "type":"Event"
    })
   }
}
