import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(private http: HttpClient) { }

  getContents(): Observable<any> {
    return this.http.get<any>(`http://localhost:3001/contents`)
  }


  getContentByType(eventType:string):Observable<any>
{
  return this.http.post<any>(`http://172.31.252.101:8080/bookmyshow/api/events/filter`,{eventType})
}}
