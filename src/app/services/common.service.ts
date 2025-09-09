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

  getAllCities(): Observable<any> {
    return this.http.get(`${this.baseUrl}/city/all`)
  }
  getPopularCities(): Observable<any> {
    return this.http.get(`${this.baseUrl}/city/popular`)
  }

  setCategory(category: string) {
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


 

}
