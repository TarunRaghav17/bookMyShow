import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(private http: HttpClient) { }

  baseUrl = environment.baseUrl
  

  getContentByType(eventType: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/events/filter`, { type:eventType })
  }

  getLanguagesByContentType(contentType: string | null) {
    return this.http.get<any>(`${this.baseUrl}/api/events/languages?eventType=${contentType}`)
  }

  getGenresByContentType(contentType: string | null) {
    return this.http.get<any>(`${this.baseUrl}/api/events/genres?eventType=${contentType}`)
  }
  getFormatsByContentType(contentType: string | null) {
    return this.http.get<any>(`${this.baseUrl}/api/events/formats?eventType=${contentType}`)
  }

  getTagsByContentType(contentType: string | null) {
    return this.http.get<any>(`${this.baseUrl}/api/events/tags?eventType=${contentType}`)
  }


  getCategoriesByContentType(contentType: string | null) {
    return this.http.get<any>(`${this.baseUrl}/api/events/categories?eventType=${contentType}`)
  }

  getMoreFiltersByContentType(contentType: string | null) {
    return this.http.get<any>(`${this.baseUrl}/api/events/more-filters?eventType=${contentType}`)
  }
}
