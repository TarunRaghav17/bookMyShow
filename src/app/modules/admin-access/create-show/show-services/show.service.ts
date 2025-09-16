import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShowService {

  constructor(private http: HttpClient) { }

  createShow(payload: any): Observable<any> {
    return this.http.post<any>(`http://localhost:3000/shows`, payload)
  }
}
