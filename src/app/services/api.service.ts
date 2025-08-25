import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  base_url = 'http://172.31.252.101:8080/bookmyshow'

  constructor(private http: HttpClient) { }

  get(endPoint: string): Observable<any> {
    return this.http.get(`${this.base_url}${endPoint}`);
  }
  post(endPoint: string, data: any): Observable<any> {
    console.log(data, 'comons eser')
    return this.http.post(`${this.base_url}/${endPoint}`, data);
  }




  // put(path: string, data: any): Observable<any> {
  //   return this.http.put(path, data);
  // }
  // delete(path: string, id: any): Observable<any> {
  //   return this.http.delete(`${path}/${id}`);
  // }
}
