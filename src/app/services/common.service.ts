import { LoaderService } from './loader.service';
import { computed, Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpContext, HttpContextToken } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  baseUrl = environment.baseUrl;
  IS_PUBLIC_API = new HttpContextToken<boolean>(() => false);
  city = sessionStorage.getItem('selectedCity');
  _selectCity = signal<any>(this.city ? JSON.parse(this.city) : null);
  _profileHeader = signal<any>(false);
  searchSubject = new Subject<string>();
  selectedCategory: any = localStorage.getItem('category');
  _selectedCategory = signal<any>(JSON.parse(this.selectedCategory));
  userLangFormat = signal<any>({})
  filtersSignal = signal<any[]>([])
  showHeader = signal<boolean>(true)
 
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private loaderService: LoaderService
  ) { }

  setUserLangFormat(payload: any) {
    this.userLangFormat.set(payload)
  }

  getUserLangFormat() {
    return this.userLangFormat()
  }

  movieDetails = signal<any>({})

  setMovieDetails(payload: any) {
    this.movieDetails.set(payload)
  }

  getMovieDetails() {
    return this.movieDetails()
  }

  userSelectedDate = signal<any>({})

  setUserSelectedDate(index: number, payload: any) {
    if (index < 3) this.userSelectedDate.set(payload)
    return
  }

  getUserSelectedDate() {
    return this.userSelectedDate()
  }
  selectedFiltersSignal = signal<any>(
    [
      {
        type: "Language",
        data: []
      },
      {
        type: "Genres",
        data: []
      },
      {
        type: "Formats",
        data: []
      },
      {
        type: "Categories",
        data: []
      },
      {
        type: "More Filters",
        data: []
      },
      {
        type: "Price",
        data: []
      },
      {
        type: "Tags",
        data: []
      },
      {
        type: "Date",
        data: []
      },
      {
        type: "Release Month",
        data: []
      },
    ])

  resetSelectedFiltersSignal() {
  const reset = this.selectedFiltersSignal().map((group:any) => ({...group,data: [] }));
  this.selectedFiltersSignal.set(reset);
}

  setFiltersSignal(filters: any) {
    let modifiedFilters = this.formatFilters(filters)
    this.filtersSignal.set(modifiedFilters)
  }

  topFiltersArray = computed(() =>
    this.filtersSignal()
      .filter(group =>
      ({
        type: group.type,
        data: group.data.filter((item: any) => !item.selected)
      }))
      .filter(group => group.data.length > 0)
  );

  /**
   * @description Get list of all cities from backend
   * @author Gurmeet Kumar
   * @return Observable<any>
   */
  getAllCities(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/city/all`, {
      context: new HttpContext().set(this.IS_PUBLIC_API, true),
    });
  }

  getContentDetailsById(contentId: string | null): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/events/${contentId}`);
  }
  /**
   * @description Get list of popular cities from backend
   * @author Gurmeet Kumar
   * @return Observable<any>
   */
  getPopularCities(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/city/popular`,
      {
        context: new HttpContext().set(this.IS_PUBLIC_API, true),
      }
    );
  }
  setCategory(category: string | null) {
    this._selectedCategory.set(category);
    localStorage.setItem('category', JSON.stringify(category));
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
        i.selected = false;
        return item;
      });
    });
  }
 

  /**
   * @description iniitalizes the topFilterArray
   * @author Manu Shukla
   * @params  [Filters] receives array of filters
   * @returnType [Filter] return the filteredArray on the basis of category
   */
  getTopFiltersArray(target: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/events/${target}`);
  }

  /**
   * @description Takes Filters Array , toggle the selected key and push into selectFilters array
   * @author Manu Shukla
   * @params  [Filters]
   * @returnType void
   */
  handleEventFilter(filter: any): void {
    this.filtersSignal().map((item: any) => {
      if (item.type == filter.type) {
        item.data.map((i: any) => {
          if (i?.text == filter.filterName?.text) {
            i.selected = !i.selected;
          }
        });
      }
    }
    )
    let filterType: any[] = this.selectedFiltersSignal().filter((item: any) =>
      item.type == filter.type
    )
    if (filterType.length > 0) {
      let alreayExist = filterType[0].data.filter((i: any) => i?.text == filter.filterName?.text)
      if (alreayExist.length == 0) {
        filterType[0].data.push(filter.filterName)
        filterType[0].data.sort((a: any, b: any) => a.id - b.id)
        return filterType[0].data.sort((a: any, b: any) => a.index - b.index)
      }
      else {
        filterType[0].data = filterType[0].data.filter((i: any) => i?.text != filter.filterName?.text)
      }
    }
  }


  /**
   * @description Convert base64 string to safe image URL for display
   * @author Gurmeet Kumar
   * @return any
   */
  getImageFromBase64(base64string: string): any {
    if (base64string) {
      const fullBase64String = `data:${base64string};base64,${base64string}`;
      return this.sanitizer.bypassSecurityTrustUrl(fullBase64String);
    }
  }

  getEventDetailsById(id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/events/${id}`, {
      context: new HttpContext().set(this.IS_PUBLIC_API, true)
    });
  }
  /**
   * @description Format date to MM/DD/YYYY
   * @author Gurmeet Kumar  
   * @param date Input date string
   * @return string | null Formatted date or null if input is null
   */

  formatDateToMMDDYYYY(date: string | null): string | null {
    if (!date) return null;
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // MM
    const day = d.getDate().toString().padStart(2, '0'); // DD
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  }
  /**
   * @description Format data to patch YYYY/DD/MM
   * @author Gurmeet Kumar  
   * @param date Input date string
   * @return string | null Formatted date or null if input is null
   */
  formatDateForPatch(date: string | null): string | null {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear();

    return `${year}-${month}-${day}`;
  }

  listYourShowService = [
    {
      image: 'assets/images/list-your-show/online-saless.png',
      tittle: 'Online Sales & Marketing',
      description:
        'Ensure convenience through both online and offline tickets for your attendees.',
      itemsList: [
        'Target millions of potential customers',
        'Hassle free sales',
        'Create custom discounts',
        'Engage on social media',
        'Sell more tickets on ground',
      ],
    },
    {
      image: 'assets/images/list-your-show/pricings.png',
      tittle: 'Pricing',
      description: 'Pricing, inventory, and payment reconciliation.',
      itemsList: [
        'Pricing recommendations',
        'Hassle free sales',
        'Create custom discounts',
        'Engage on social media',
        'Sell more tickets on ground',
      ],
    },
    {
      image: 'assets/images/list-your-show/food.png',
      tittle: 'Food & beverages, stalls and the works!',
      description:
        'Maximise your space with an array of food and beverage and merchandising vendors.',
      itemsList: [
        'Cashless payments',
        'Age verification counters',
        'Offer sponsor discounts',
        'Engage on social media',
        'Ticket specific offerings',
      ],
    },
    {
      image: 'assets/images/list-your-show/on-ground-support.png',
      tittle: 'On ground support & gate entry management',
      description:
        'Get everything you need to setup from a music gig to a theatrical performance.',
      itemsList: [
        'Stage setup',
        'logistics and handling',
        'Box office support',
        'Engage on social media',
        'And so on...',
      ],
    },
    {
      image: 'assets/images/list-your-show/report.png',
      tittle: 'Reports & business insights',
      description:
        'Get detailed insights into and cohesive reports about your event.',
      itemsList: [
        'In depth reports',
        'Access registration data',
        'behavioural insights',
      ],
    },
    {
      image: 'assets/images/list-your-show/rfids.png',
      tittle: 'POS, RFID, Turnstiles & more...',
      description: 'Still searching for reasons? We also offer these.',
      itemsList: [
        'Digital tickets',
        'Print at Home ticket solution',
        'Mobile ticket scanning',
      ],
    },
  ];


  formatFilters(filters: any): any {
    let filtersArray: any = [];

    filters.map((filter: any) => {
      let { data, type } = filter;
      let filteredData;
      switch (type) {
        case 'Language':
          filteredData = data.map((i: any) => ({ ...i, text: i.languageName, selected: false, id: i.languageId }));
          break;

        case 'Genres':
          filteredData = data.map((i: any) => ({ ...i, text: i.genresName, selected: false, id: i.genresId }));
          break;

        case 'Formats':
          filteredData = data.map((i: any) => ({ ...i, text: i.formatName, selected: false, id: i.formatId }));
          break;

        case 'Date':
          filteredData = data.map((i: any) => ({ ...i, text: i.dateFilterName, selected: false }));
          break;

        case 'Categories':
          filteredData = data.map((i: any) => ({ ...i, text: i.categoryName, selected: false }));
          break;

        case 'More Filters':
          filteredData = data.map((i: any) => ({ ...i, text: i.moreFilterName, selected: false }));
          break;

        case 'Price':
          filteredData = data.map((i: any) => ({ ...i, text: i.priceRange, selected: false }));
          break;

        case 'Tags':
          filteredData = data.map((i: any) => ({ ...i, text: i.tagName, selected: false }));
          break;

        case 'Release Month':
          filteredData = data.map((i: any) => ({ ...i, text: i.releaseMonthName, selected: false }));
          break;

        default:
          filteredData = data;
      }
      filtersArray.push({ type, data: filteredData });
    });
    return filtersArray;
  }

  getAllVenuesBYcity(city: String): Observable<any> {
    return this.http.get(`${this.baseUrl}/venues/city/${city}`, {
      context: new HttpContext().set(this.IS_PUBLIC_API, true)
    })
  }

  /**
  * @description get all notification by userId
  * @author Gurmeet Kumar  
  * @return Notification json data
  */
  getAllnotification(userId?: number, pageNumber?: number, size?: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/notifications/get-notification/${userId}?page=${pageNumber}&size=${size}`,
      { context: new HttpContext().set(this.loaderService.NO_LOADER, false) }
    )
  }
  /**
* @description Change  Notification Read flag
* @author Gurmeet Kumar  
*/
  readNotification(userID: number, notificationId: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/api/notifications/${userID}/${notificationId}/read`, { userID, notificationId })
  }
  /**
  * @description  Notification unreadRead get count  
  * @author Gurmeet Kumar  
  */
  unReadNotification(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/notifications/get-notification-unread-count/${userId}`,
      { context: new HttpContext().set(this.loaderService.NO_LOADER, false) }
    )
  }

}

