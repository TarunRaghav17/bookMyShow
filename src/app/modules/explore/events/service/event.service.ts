import { CommonService } from './../../../../services/common.service';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http:HttpClient,private commonService:CommonService) { }

   base_url = 'http://172.31.252.101:8080/bookmyshow'

   getAllEvents():Observable<any>{
    return this.http.post(`${this.base_url}/api/events/filter`,{
      "type":"Event"
    },{
      context: new HttpContext().set(this.commonService.IS_PUBLIC_API, true)
    })
   }

   getFilters(target:any):Observable<any>{
       let Target= target.split('_').join('-')
      return this.http.get(`${this.base_url}/api/events/${Target}?eventType=Event`,{
        context: new HttpContext().set(this.commonService.IS_PUBLIC_API, true)
      })
    }
}
