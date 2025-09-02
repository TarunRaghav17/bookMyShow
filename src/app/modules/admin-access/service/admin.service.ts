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

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/users`)
  }
  getUserById(id: any) {
    return this.http.get(`${this.baseUrl}/api/users/${id}`)
  }


  deleteUserById(id: any) {
    return this.http.patch(`${this.baseUrl}/api/users/delete-user/${id}`, id)
  }


}