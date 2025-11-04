import { Component } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { forkJoin } from 'rxjs';
import { MovieService } from '../service/movie-service.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'app-upcomming-movies',
  standalone: false,
  templateUrl: './upcomming-movies.component.html',
  styleUrl: './upcomming-movies.component.scss'
})
export class UpcommingMoviesComponent {
  dummyMoviesdata: any[] = []
  selectedFilters: any[] = []
  selectedCity: any = null
  topFiltersArray!: any[]
  filters: any[] = []
  filtersArray: any[] = []
  page: number = 0
  size: number = 8
  totalCount:number = 0
  shouldCallAPI: boolean = false
  sendPayload: any = {
    "type": "string",
    "languages": [],
    "genres": [],
    "formats": [],
    "tags": [],
    "releaseMonths": [],
    "dateFilters": [],
    "cityid":0
  }

  constructor(public commonService: CommonService, private movieService: MovieService, private toastr: ToastrService, public loaderService: LoaderService) {
    this.selectedCity = this.commonService._selectCity()
    this.commonService._selectedCategory.set('Movies');
  }
  ngOnInit(): void {
    this.setFilter()
    this.sendPayload.type = 'Movie'
    this.sendPayload.cityid = Number(sessionStorage.getItem('selectedCityId'))
    this.getAllUpcomingMovies()

  }

  /**
  * @description Display All Events Cards
  * @author Manu Shukla
  */
  getAllUpcomingMovies() {
    this.movieService.getAllUpcomingMovies(this.sendPayload, this.page, this.size).subscribe({
      next: (res) => {
          this.totalCount = res.data.count
        let resData = res.data.content
       this.dummyMoviesdata.push(...resData)
      },
      error: (err) => {
        this.toastr.error(err.message);
      }
    })
  }

  /**
* @description Set All Filters by using ForkJoin 
* @author Manu Shukla
*/
  setFilter() {
    forkJoin([
      this.movieService.getFilters('languages'),
      this.movieService.getFilters('genres'),
      this.movieService.getFilters('tags'),
      this.movieService.getFilters('formats'),
      this.movieService.getFilters('release-months')
    ]).subscribe({
      next: ([languages, genres, tags, formats, releaseMonth]) => {
        let filters = [
          { type: 'Language', data: languages.data },
          { type: 'Genres', data: genres.data },
          { type: 'Tags', data: tags.data },
          { type: 'Formats', data: formats.data },
          { type: 'Release Month', data: releaseMonth.data }
        ];
        this.commonService.setFiltersSignal(filters)
      },
      error: (err) => {
        this.toastr.error(err.message);
      }
    });
  }
  /**
* @description Remove Already Selected Filters
* @author Manu Shukla
* @params  
* @returnType void
*/
  ngOnDestroy(): void {
    this.commonService.resetSelectedFiltersSignal()
  }
  toggleId(array: any[], id: any): void {
    const index = array.indexOf(id);
    if (index > -1) {
      array.splice(index, 1);
    } else {
      array.push(id);
    }
  }

   /**
  * @description Get Selected Filters cards by sending the Payload
  * @author Manu Shukla
  * @param  {event} - Object containing filter type and corresponding filter ID
   */
  getFilter(event: any) {
    switch (event.type) {
      case 'Language':
        this.toggleId(this.sendPayload.languages, event.filterName.languageId);
        break;

      case 'Genres':
        this.toggleId(this.sendPayload.genres, event.filterName.genresId);
        break;

      case 'Formats':
        this.toggleId(this.sendPayload.formats, event.filterName.formatId)
        break;

      case 'Tags':
        this.toggleId(this.sendPayload.tags, event.filterName.tagId)
        break;

      case 'Release Month':
        this.toggleId(this.sendPayload.releaseMonths, event.filterName.releaseMonthId)
        break;
    }
    this.page = 0;
    this.dummyMoviesdata = [];
    this.getAllUpcomingMovies()
    this.commonService.handleEventFilter(event)
  }

  /**
* @description Remove Selected Filters by empty the payload array
* @author Manu Shukla
* @param  {item} - Filter Type (Date, Categories, More Filters, Prices)
*/
  clearFilter(item: any) {
    if (!item) return;
    switch (item) {
      case 'Language':
        if (this.sendPayload.languages.length > 0) {
          this.sendPayload.languages = [];
          this.commonService.clearSelectedFilterByType('Language');
          this.shouldCallAPI = true
        }
        else {
          this.shouldCallAPI = false
        }
        break;

      case 'Genres':
        if (this.sendPayload.genres.length > 0) {
          this.sendPayload.genres = [];
          this.commonService.clearSelectedFilterByType('Genres');
          this.shouldCallAPI = true
        }
        else {
          this.shouldCallAPI = false
        }
        break;

      case 'Formats':
        if (this.sendPayload.formats.length > 0) {
          this.sendPayload.formats = [];
          this.commonService.clearSelectedFilterByType('Formats');
          this.shouldCallAPI = true
        }
        else {
          this.shouldCallAPI = false
        }
        break;

      case 'Tags':
        if (this.sendPayload.tags.length > 0) {
          this.sendPayload.tags = [];
          this.commonService.clearSelectedFilterByType('Tags');
          this.shouldCallAPI = true
        }
        else {
          this.shouldCallAPI = false
        }
        break;

      case 'Release Month':
        if (this.sendPayload.releaseMonths.length > 0) {
          this.sendPayload.releaseMonths = [];
          this.commonService.clearSelectedFilterByType('Release Month');
          this.shouldCallAPI = true
        }
        else {
          this.shouldCallAPI = false
        }
        break;

      default:
        break;
    }
    if (this.shouldCallAPI) {
      this.page = 0;
      this.dummyMoviesdata = [];
      this.getAllUpcomingMovies();
    }
  }

  /**
* @description Pagination - Load More Activities Cards on Scroll
* @author Manu Shukla
*/
  onScroll(event: any) {
    const element = event.target as HTMLElement;
    if (element.scrollHeight - element.scrollTop <= element.clientHeight && this.dummyMoviesdata.length < this.totalCount ) {
      this.page++
      this.getAllUpcomingMovies()
    }
  }

  /**
* @description If there is no data in selected filter then reset the all filter 
* @author Manu Shukla
*/ 
  resetFilter() {
    this.commonService.selectedFiltersSignal().map((item: any) => {
      item.data.map((i: any) => {
        i.selected = false
      })
    }
    )
    this.commonService.resetSelectedFiltersSignal()
    this.sendPayload = {
      "type": "Movie",
      "languages": [],
      "genres": [],
      "formats": [],
      "tags": [],
      "releaseMonths": [],
      "dateFilters": [],
      "cityid": Number(sessionStorage.getItem('selectedCityId'))
    }
    this.getAllUpcomingMovies()
  }
}