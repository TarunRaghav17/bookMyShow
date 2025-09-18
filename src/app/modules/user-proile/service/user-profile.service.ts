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

  /** 
   * @description Update user profile details
   * @author Gurmeet Kumar
   * @return Observable<any>
   * @param data
   */
  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/user/profile`, data);
  }

   /** 
   * @description Upload user profile image
   */
  uploadImage(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/user/uploadProfileImage`, data);
  }
   /** 
   * @description Get user profile details
   */
  getUserProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/user/profile`);
  }
 /** 
   * @description Update user email or phone number
   * @param data
   */
  updateEmailOrPhone(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/user/updateEmailOrPhone`, data);
  }

  /** 
   * @description Verify email or phone number for update
   * @param data
   */
  verifyEmailOrPhone(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/user/verifyEmailOrPhone`, data);
  }

   /**
 * @description get user byId 
 * @author Gurmeet Kumar
 * @param id
 */
  getUserById(id: any) {
    return this.http.get(`${this.baseUrl}/api/users/${id}`)
  }
}
