import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  city = sessionStorage.getItem("selectedCity");
  _selectCity = signal<any>(this.city ? JSON.parse(this.city) : '');


  // -----------inz-start-------------------
  selectedCategory=(sessionStorage.getItem('selectedCategory'))
  _selectedCategory=signal<string | null>(this.selectedCategory? JSON.parse(this.selectedCategory): null)

  // --------------inz-end-------------------
  _profileHeader = signal<any>(false)

  constructor(private http:HttpClient) {
  }

getCityNameByLocation(lat:number,lon:number){
  
  return this.http.get<any>(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
}



  setSelectedCategory(category:string | null){
    this._selectedCategory.set(category)
    sessionStorage.setItem('selectedCategory', JSON.stringify(category))


  }
 getCurrentLocation(options = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
 this.getCityNameByLocation(coords.latitude,coords.longitude).subscribe(res=>
  resolve(res.address.city)
 )
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
    
    );
  });
}



}


