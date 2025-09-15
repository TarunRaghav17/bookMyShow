import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShowsService {


  constructor(private http:HttpClient) { }

  createShow(payload:any):Observable<any>{
    return this.http.post<any>(`http://localhost:3000/shows`,payload)
  }

// temp service to get city (testing purpose)

getCitites():Observable<any>{
  return this.http.get<any>(`http://localhost:3003/cities`)
}


payload={
  
  "venueName": "v1",
  "venueCapacity": 100,
  "venueFor": "movies",
  "venueType": "theatre",
  "address": {
    
    "street": "s1",
    "city": "noida",
    "pin": "123456"
  },
  "amenities": [
    {
      "id": 0,
      "amenityName": "light"
    }
  ],
  "supportedCategories": [
    {
      
      "categoryName": "3d"
    }
  ],
  "screens": [
    {
      
      "screenName": "s1",
      "layouts": [
        {
          
          "layoutName": "l1",
          "rows": ["A","B"],
          "cols": 10
        }
      ]
    }
  ]
  
}



}
