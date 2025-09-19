import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { CommonService } from '../../../services/common.service';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient, private commonService: CommonService) { }

  getAllStates(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/states`, {
      context: new HttpContext().set(this.commonService.IS_PUBLIC_API, true),
    });
  }

  /**
   * @description Update user profile details
   * @author Gurmeet Kumar
   * @return Observable<any>
   * @param id, data
   */
  updateProfile(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/users/${id}/profile`, data);
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
  updateEmailOrPhone(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/users/${id}/profile`, data);
  }
  /**
* @description get user byId 
* @author Gurmeet Kumar
* @param id
*/
  getUserById(id: any) {
    return this.http.get(`${this.baseUrl}/api/users/${id}/profile`)
  }
}
