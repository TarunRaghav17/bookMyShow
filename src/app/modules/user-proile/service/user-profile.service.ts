import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getAllStates(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/states`);
  }
}
