import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../../../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
 
  constructor(private http: HttpClient,private commonService:CommonService) { }

  base_url = 'http://172.31.252.101:8080/bookmyshow'

  getAllActivities(body:any,page:number=0,size:number=5): Observable<any> {
    return this.http.post(`${this.base_url}/api/events/filter?page=${page}&size=${size}`,body,{
      context: new HttpContext().set(this.commonService.IS_PUBLIC_API, true),
    })
  }

  getFilters(target: string): Observable<any> {
    let mTarget = target.split('_').join('-')
    return this.http.get(`${this.base_url}/api/events/${mTarget}?eventType=Activities`,{
      context: new HttpContext().set(this.commonService.IS_PUBLIC_API, true),
    })
  }
}
