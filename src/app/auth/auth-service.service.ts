import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  base_url = environment.baseUrl

  userLogin(obj: any): Observable<any> {

    return this.http.post<any>(`${this.base_url}/auth/login`, obj)
  }

  userSignup(data: any): Observable<any> {
    return this.http.post<any>(`${this.base_url}/auth/register`, data)
  }
}
