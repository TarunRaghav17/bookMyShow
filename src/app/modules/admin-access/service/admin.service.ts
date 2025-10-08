import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) { }

  baseUrl = environment.baseUrl

  /**
   * @description getAll usersList
   * @author Gurmeet Kumars
   */
  getAllUsers(page: number = 0, size: number = 10, roleName?: string): Observable<any> {
    let url = ''
    if (roleName) {
      url = `${this.baseUrl}/api/users?roleName=${roleName}&page=${page}&size=${size}`
    } else {
      url = `${this.baseUrl}/api/users?page=${page}&size=${size}`;
    }
    return this.http.get(url);
  }
  /**
 * @description get user byId 
 * @author Gurmeet Kumar
 * @param id
 */
  getUserById(id: any) {
    return this.http.get(`${this.baseUrl}/api/users/${id}`)
  }

  /**
  * @description soft delete by admin  Users Here is change only deleteFlag change boolean
  * @author Gurmeet Kumar
  * @param id
  */

  deleteUserById(id: any) {
    return this.http.patch(`${this.baseUrl}/api/users/delete-user/${id}`, id)
  }

  /**
     * @description Search param by Userdata   
     * @author Gurmeet Kumar
     * @param searchText
     */

  serachUsers(searchText: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/users/search?value=${searchText}`);
  }

  /**
 * @description edit user role by id
 * @author Gurmeet Kumar
 * @params id, roleName
 */
  editRoleById(id: any) {
    return this.http.put(`${this.baseUrl}/api/users/${id}/role`, id)
  }
}