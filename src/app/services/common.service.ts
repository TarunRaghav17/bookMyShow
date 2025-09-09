import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class CommonService {
  city = sessionStorage.getItem("selectedCity");
  _selectCity = signal<any>(this.city ? JSON.parse(this.city) : null);
  _profileHeader = signal<any>(false);
  searchSubject = new Subject<string>();
  _selectedCategory = signal<any>('');

  constructor(private http: HttpClient) { }

  baseUrl = environment.baseUrl

  /**
   * @description Get list of all cities from backend
   * @author Gurmeet Kumar
   * @return Observable<any>
   */
  getAllCities(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/city/all`);
  }

  /**
   * @description Get list of popular cities from backend
   * @author Gurmeet Kumar
   * @return Observable<any>
   */
  getPopularCities(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/city/popular`);
  }



  listYourShowService = [
    {
      image: 'assets/images/list-your-show/online-saless.png',
      tittle: 'Online Sales & Marketing',
      description: 'Ensure convenience through both online and offline tickets for your attendees.',
      itemsList: ['Target millions of potential customers', 'Hassle free sales', 'Create custom discounts', 'Engage on social media', 'Sell more tickets on ground']
    },
    {
      image: 'assets/images/list-your-show/pricings.png',
      tittle: 'Pricing',
      description: 'Pricing, inventory, and payment reconciliation.',
      itemsList: ['Pricing recommendations', 'Hassle free sales', 'Create custom discounts', 'Engage on social media', 'Sell more tickets on ground']
    },
    {
      image: 'assets/images/list-your-show/food.png',
      tittle: 'Food & beverages, stalls and the works!',
      description: 'Maximise your space with an array of food and beverage and merchandising vendors.',
      itemsList: ['Cashless payments', 'Age verification counters', 'Offer sponsor discounts', 'Engage on social media', 'Ticket specific offerings']
    },
    {
      image: 'assets/images/list-your-show/on-ground-support.png',
      tittle: 'On ground support & gate entry management',
      description: 'Get everything you need to setup from a music gig to a theatrical performance.',
      itemsList: ['Stage setup', 'logistics and handling', 'Box office support', 'Engage on social media', 'And so on...']
    },
    {
      image: 'assets/images/list-your-show/report.png',
      tittle: 'Reports & business insights',
      description: 'Get detailed insights into and cohesive reports about your event.',
      itemsList: ['In depth reports', 'Access registration data', 'behavioural insights']
    },
    {
      image: 'assets/images/list-your-show/rfids.png',
      tittle: 'POS, RFID, Turnstiles & more...',
      description: 'Still searching for reasons? We also offer these.',
      itemsList: ['Digital tickets', 'Print at Home ticket solution', 'Mobile ticket scanning']
    },

  ]
}