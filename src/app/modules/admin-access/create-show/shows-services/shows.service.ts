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
  /**
* @description service function  that hits the api and create content (movie,event,plays,etc...)
* @author Inzamam
* @params payload,poster ,casts,crews
* @return Observable
*/
  createShow(payload: any, poster: File, casts: File[], crews: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('event', JSON.stringify(payload));
    if (poster) formData.append('poster', poster);
    casts?.forEach((file: any) => formData.append('castImages', file.castImg));
    crews?.forEach((file: any) => formData.append('crewImages', file.crewImg));
    return this.http.post<any>(`${this.baseUrl}/api/events/create-event`, formData)
  }
}