import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import * as CryptoJS from 'crypto-js';
import { CommonService } from '../services/common.service';
import { LoaderService } from '../services/loader.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private secretKey = environment.secretKey;
  encrypted!: string;
  baseUrl = environment.baseUrl;
  tokenSignal = signal<string | null>(localStorage.getItem('token'));
  constructor(private http: HttpClient, private commonService: CommonService, private loaderService: LoaderService) {
  }

  /**
   * @description Holds decoded user details from token
   * @author Gurmeet Kumar
   */
  userDetailsSignal = signal<any>(this.getUserFromToken());

  /**
   * Clear decoded user details from token
   * @author Gurmeet Kumar
   */
  clearUserDetails(): void {
    localStorage.removeItem('token');
    this.userDetailsSignal.set(null);
  }
  /**
   * @description Send login request to backend
   * @author Gurmeet Kumar
   * @return Observable<any>
   */
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, credentials, {
      context: new HttpContext().set(this.commonService.IS_PUBLIC_API, true)
    });
  }

  /**
   * @description Send signup request to backend
   * @author Gurmeet Kumar
   * @return Observable<any>
   */
  signup(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/register`, data, {
      context: new HttpContext().set(this.commonService.IS_PUBLIC_API, true)
    });
  }

  /**
   * @description here is validate userName  check DB is Allow Entred username      
   * @author Gurmeet Kumar
   * @param name
   */
  validateUserName(userName: any): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/auth/validate/username?username=${userName}`,
      {
        context: new HttpContext()
          .set(this.commonService.IS_PUBLIC_API, true)
          .set(this.loaderService.NO_LOADER, false)
      }
    );
  }
  /**
   * @description Clear token and logout user
   * @author Gurmeet Kumar
   * @return void
   */
  logout(userId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/logout?userId=${userId}`, userId)
  }

  /**
   * @description Decode token from localStorage if available
   * @author Gurmeet Kumar
   * @return any | null
   */
  getUserFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return this.decodeToken(token);
  }
  /**
    * @description Check if token is expired
    * @author Gurmeet Kumar
    * @return any | null
    */

  isTokenExpired(token: string) {
    try {
      const decoded: any = JSON.parse(atob(token.split('.')[1]));
      if (!decoded?.exp) return true;
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  }

  /**
   * @description Check if user is logged in
   * @author Gurmeet Kumar
   * @return boolean
   */
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  /**
   * @description Get role from decoded token
   * @author Gurmeet Kumar
   * @return string | null
   */
  getUserRole(): string | null {
    const user = this.getUserFromToken();
    return user?.role || null;
  }

  /**
   * @description Decode JWT token
   * @author Gurmeet Kumar
   * @return any | null
   */
  decodeToken(token: string) {
    try {
      const userDetails: any = jwtDecode(token);
      return userDetails;
    } catch (error) {
      return null;
    }
  }

  /**
   * @description Encrypt value using AES256
   * @author Gurmeet Kumar
   * @return string
   */
  encryptUsingAES256(val: any): string {
    const _key = CryptoJS.enc.Base64.parse(this.secretKey);
    const _iv = CryptoJS.enc.Base64.parse(this.secretKey);
    let encrypted = CryptoJS.AES.encrypt(val, _key, {
      keySize: 32,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    this.encrypted = encrypted.toString();
    return this.encrypted;
  }

  /**
   * @description Decrypt value using AES256
   * @author Gurmeet Kumar
   * @return string
   */
  decryptUsingAES256(val: any): string {
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

  /**
    * @description Not Add Space in Input Feild
    * @author Gurmeet Kumar
    * @param event
    */
  blockSpace(event: KeyboardEvent) {
    if (event.keyCode === 32) {
      event.preventDefault();
    }
  }
}

