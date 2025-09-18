import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
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
   * @description Holds decoded user details from token
   * @author Gurmeet Kumar
   */
  userDetailsSignal = signal<any>(this.getUserFromToken());

  /**
   * @description Send login request to backend
   * @author Gurmeet Kumar
   * @return Observable<any>
   */
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, credentials);
  }

  /**
   * @description Send signup request to backend
   * @author Gurmeet Kumar
   * @return Observable<any>
   */
  signup(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/register`, data);
  }

  /**
   * @description here is validate userName  check DB is Allow Entred username
   * @author Gurmeet Kumar
   * @param name
   */
  validateUserName(userName: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/validate/username?username=${userName}`)
  }

  /**
   * @description Clear token and logout user
   * @author Gurmeet Kumar
   * @return void
   */
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
    this.userDetailsSignal.set(null);
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

}

