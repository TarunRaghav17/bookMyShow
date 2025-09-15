import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getEventListByType(type: any): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/api/events/get-popular-events?eventType=${type}`
    );
  }

  globalSearch(searchObj: any) {
    return this.http.post(`${this.baseUrl}/api/events/search`, searchObj);
  }
}
