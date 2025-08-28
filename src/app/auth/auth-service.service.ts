import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  userTokenDataSignal = signal<any>(
    this.islogdeIn()
  )
  base_url = environment.baseUrl

  userLogin(obj: any): Observable<any> {

    return this.http.post<any>(`${this.base_url}/auth/login`, obj)
  }

  userSignup(data: any): Observable<any> {
    return this.http.post<any>(`${this.base_url}/auth/register`, data)
  }


  isLoggedInToken(): boolean {
    return !!localStorage.getItem('token');

  }

  logout(): void {
    localStorage.removeItem('token');
  }

  islogdeIn() {
    const userToken: any = localStorage.getItem('token')
    let userDetails: any = this.getLoggedInUserDetails(userToken)
    return userDetails

  }

  getLoggedInUserDetails(token: any) {
    try {
      const userDetails: any = jwtDecode(token);
      console.log("userDetails", JSON.stringify(userDetails))
      return userDetails;
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  }

}
