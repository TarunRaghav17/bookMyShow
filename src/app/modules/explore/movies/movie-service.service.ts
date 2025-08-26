import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieServiceService {

  constructor(private http:HttpClient) {}
  
  base_url = 'http://172.31.252.101:8080/bookmyshow'

  getAllMovies():Observable<any>{
    return this.http.get(`${this.base_url}`)
  }
}
