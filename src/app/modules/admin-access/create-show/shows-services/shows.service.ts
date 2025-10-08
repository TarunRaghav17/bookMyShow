import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ShowsService {

  baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  createShow(payload: any, imageurl: string): Observable<any> {
    const formData = new FormData();
    formData.append('event', JSON.stringify(payload));
    formData.append('poster', imageurl);
    return this.http.post<any>(`${this.baseUrl}/api/events/create-event`, formData)
  }


}
