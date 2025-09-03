import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private secretKey = environment.secretKey;
  encrypted!: string;
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient, private router: Router) {
  }
  /**
    * @description  Holds our decoded userDetails from tokenData
    */
  userDetailsSignal = signal<any>(this.getUserFromToken());

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, credentials);
  }

  signup(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/register`, data);
  }


  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/'])
    this.userDetailsSignal.set(null);
  }

  getUserFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return this.decodeToken(token);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  /**
    * @description Get role from decoded token 
    * @author Gurmeet Kumar
    * @returnType role || null 
    */

  getUserRole(): string | null {
    const user = this.getUserFromToken();
    return user?.role || null;
  }

  decodeToken(token: string) {
    try {
      const userDetails: any = jwtDecode(token);
      return userDetails;
    } catch (error) {
      return null;
    }
  }

  /**
    * @description send to the encrypted password to the backend  
    * @author Gurmeet Kumar
    */

  encryptUsingAES256(val: any) {
    const _key = CryptoJS.enc.Utf8.parse(this.secretKey);
    const _iv = CryptoJS.enc.Utf8.parse(this.secretKey);
    let encrypted = CryptoJS.AES.encrypt(val, _key, {
      keySize: 32,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    this.encrypted = encrypted.toString();
    return this.encrypted;
  }

  decryptUsingAES256(val: any) {
    const _key = CryptoJS.enc.Utf8.parse(this.secretKey);
    const _iv = CryptoJS.enc.Utf8.parse(this.secretKey);
    const decrypted = CryptoJS.AES.decrypt(val, _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    return decryptedText;
  }


}
