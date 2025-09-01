import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  baseUrl = environment.baseUrl;

  // Holds decoded user details from token
  userDetailsSignal = signal<any>(this.getUserFromToken());




  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, credentials);
  }

  signup(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/register`, data);
  }


  logout(): void {
    localStorage.removeItem('token');
    this.userDetailsSignal.set(null);
  }

  getUserFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return this.decodeToken(token);
  }


  decodeToken(token: string) {
    try {
      const userDetails: any = jwtDecode(token);
      return userDetails;
    } catch (error) {
      return null;
    }
  }

}
