import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { CommonService } from '../../../../services/common.service';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient,private commmonService: CommonService) { }
  /**
   * @description Fetch popular events based on event type
   * @param type Event type (Movie, Plays, Sports, Activities)
   * @returns Observable with event list
   */
  getEventListByType(type: any): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/api/events/get-popular-events?eventType=${type}`,
      {
        context: new HttpContext().set(this.commmonService.IS_PUBLIC_API, true),
      }
    );
  }

  /**
   * @description Perform global search across events
   * @param searchObj Search payload containing filters (e.g., name, eventTypes)
   * @returns Observable with search results
   */
  globalSearch(searchObj: any) {
    return this.http.post(`${this.baseUrl}/api/events/search`, searchObj,{
      context: new HttpContext().set(this.commmonService.IS_PUBLIC_API, true),
    });
  }
}
