import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  constructor(private http:HttpClient) { }

  base_url = 'http://172.31.252.101:8080/bookmyshow'

  getAllActivities():Observable<any>{
    return this.http.post(`${this.base_url}/api/events/filter`,{
      "type":"Activities"
    })
  }
  
   getFilters(target:string):Observable<any>{
   let mTarget= target.split('_').join('-')
    return this.http.get(`${this.base_url}/api/events/${mTarget}?eventType=Activities`)
  }
}
