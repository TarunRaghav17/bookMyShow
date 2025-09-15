import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { filters, selectedFilters } from '../../../db';



@Injectable({
  providedIn: 'root'
})
export class CommonService {
  filters: any[] = filters
  select: any[] = selectedFilters

  city = sessionStorage.getItem("selectedCity");
  _selectCity = signal<any>(this.city ? JSON.parse(this.city) : null);
  _profileHeader = signal<any>(false);
  searchSubject = new Subject<string>();
  selectedCategory: any = (localStorage.getItem('category'))
  _selectedCategory = signal<any>(JSON.parse(this.selectedCategory));

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




getContentDetailsById(contentId:string | null):Observable<any>{
  return this.http.get(`${this.baseUrl}/api/events/${contentId}`)

}








  /**
   * @description Get list of popular cities from backend
   * @author Gurmeet Kumar
   * @return Observable<any>
   */
  getPopularCities(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/city/popular`);
  }

  setCategory(category: string | null) {
    this._selectedCategory.set(category)
    localStorage.setItem('category', JSON.stringify(category))
  }

  /**
* @description Resrt Filter Accordian 
* @author Manu Shukla
* @params  [Filters]
* @returnType void
*/
  resetfilterAccordian(filters: any) {
    filters.filter((item: any) => {
      item.data.filter((i: any) => {
        i.selected = false
        return item
      })
    })
  }


   /**
* @description iniitalizes the topFilterArray
* @author Manu Shukla
* @params  [Filters] receives array of filters
* @returnType [Filter] return the filteredArray on the basis of category
*/
   getTopFiltersArray(filters:any){
    return filters.filter((item: any) => {
      if (item.type == 'Language') return item.data})
    
  }

  /**
 * @description Takes Filters Array , toggle the selected key and push into selectFilters array
 * @author Manu Shukla
 * @params  [Filters]
 * @returnType void
 */

  handleEventFilter(filter: any): void {
    this.filters.map((item: any) => {
      if (item.type == filter.type) {
        item.data.map((i: any) => {
          if (i.text == filter.filterName.text) {
            i.selected = !i.selected
          }
        })
      }
    }
    )
    let filterType: any[] = this.select.filter((item: any) =>
      item.type == filter.type
    )
    if (filterType) {
      let alreayExist = filterType[0].data.filter((i: any) => i.text == filter.filterName.text)
      if (alreayExist.length == 0) {
        filterType[0].data.push(filter.filterName)
        return filterType[0].data.sort((a: any, b: any) => a.index - b.index)
      }
      else {
        filterType[0].data = filterType[0].data.filter((i: any) => i.text != filter.filterName.text)
      }
    }
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