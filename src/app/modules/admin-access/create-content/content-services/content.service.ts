import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(private http: HttpClient) { }

  baseUrl=environment.baseUrl

  getContents(): Observable<any> {
    return this.http.get<any>(`http://localhost:3001/contents`)
  }

  getContentByType(eventType: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/events/filter`, { eventType })
  }
}
