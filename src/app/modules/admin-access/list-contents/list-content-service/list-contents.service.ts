import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListContentsService {

  constructor(private http:HttpClient) { }
baseUrl=environment.baseURl;

  getContentsList(type:string,page:number,size:number){
    return this.http.post<any>(`${this.baseUrl}/api/events/filter?page=${page-1}&size=${size}`,{
      type
    })

  }
}
