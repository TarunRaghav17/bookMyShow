import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../../../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  constructor(private http: HttpClient,private commonService:CommonService) { }

  base_url = 'http://172.31.252.101:8080/bookmyshow'

  getFilters(target:string):Observable<any>{
       let Target= target.split('_').join('-')
    return this.http.get(`${this.base_url}/api/events/${Target}?eventType=Movie`,{
      context: new HttpContext().set(this.commonService.IS_PUBLIC_API, true)
    })
  }

  getAllMovies(body:any,page:number=0,size:number=8):Observable<any>{
    return this.http.post(`${this.base_url}/api/events/filter?page=${page}&size=${size}`,body,{
    context: new HttpContext().set(this.commonService.IS_PUBLIC_API, true)
  })
  }

    getAllUpcomingMovies(body:any,page:number=0,size:number=8):Observable<any>{
    return this.http.post(`${this.base_url}/api/events/filter?page=${page}&size=${size}&upcomingMovie=false`,body,{
    context: new HttpContext().set(this.commonService.IS_PUBLIC_API, true)
  })
}
}
