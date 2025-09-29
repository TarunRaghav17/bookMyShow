import { Component, OnDestroy } from '@angular/core';
import { movies, selectedFilters } from '../../../../../../db';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { MovieService } from '../service/movie-service.service';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'app-movie',
  standalone: false,
  templateUrl: './movies-landingpage.component.html',
  styleUrl: './movies-landingpage.component.scss'
})
export class MovieLandingPageComponent implements OnDestroy {
  dummyMoviesdata: any[] = []
  selectedCity: any = null
  topFiltersArray!: any[]
  filtersArray: any[] = []
  originalMovies = movies;
  select: any[] = selectedFilters
  page: number = 0;
  size: number = 8;
  totalCount: number = 0
  shouldCallAPI: boolean = false
  sendPayload: any = {
    "type": "string",
    "languages": [],
    "genres": [],
    "formats": [],
  }

  constructor(public commonService: CommonService, public router: Router, private movieService: MovieService, private toastr: ToastrService, public loaderService: LoaderService) {
    this.selectedCity = this.commonService._selectCity()
    this.commonService._selectedCategory.set('Movies');
  }

  /**
   * @description initialize Top Filters
   * @author Manu Shukla
   * @params  
   * @returnType void
   */

  ngOnInit(): void {
    this.setFilter()
    this.sendPayload.type = 'Movie'
    this.getAllMovies()
  }

  /**
* @description Set All Filters by using ForkJoin 
* @author Manu Shukla
*/
  setFilter() {
    forkJoin([
      this.movieService.getFilters('languages'),
      this.movieService.getFilters('genres'),
      this.movieService.getFilters('formats')
    ]).subscribe({
      next: ([languages, genres, formats]) => {
        let filters = [{ type: 'Language', data: languages.data }, { type: 'Genres', data: genres.data }, { type: 'Formats', data: formats.data }];
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
    }
    this.page = 0;
    this.dummyMoviesdata = [];
    this.getAllMovies()
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
        if (this.sendPayload.languages.length> 0) {
          this.sendPayload.languages = [];
          this.commonService.clearSelectedFilterByType('Language');
          this.shouldCallAPI = true
        }
        else {
          this.shouldCallAPI = false
        }
        break;

      case 'Genres':
        if (this.sendPayload.genres.length> 0) {
          this.sendPayload.genres = [];
          this.commonService.clearSelectedFilterByType('Genres');
          this.shouldCallAPI = true
        }
        else {
          this.shouldCallAPI = false
        }
        break;

      case 'Formats':
        if(this.sendPayload.formats.length> 0){
          this.sendPayload.formats = [];
          this.commonService.clearSelectedFilterByType('Formats');
          this.shouldCallAPI=true
        }
        else {
          this.shouldCallAPI = false
        }
        break;

      default:
      break;
    }
    if(this.shouldCallAPI){
      this.page = 0;
      this.dummyMoviesdata = [];
      this.getAllMovies();
    }
  }


  /**
  * @description Display All Events Cards
  * @author Manu Shukla
  */
  getAllMovies() {
    {
      this.movieService.getAllMovies(this.sendPayload, this.page, this.size).subscribe({
        next: (res) => {
          this.totalCount = res.data.count
          let resData = res.data.content
          this.dummyMoviesdata.push(...resData)
        },
        error: (err) => {
          this.toastr.error(err.message);
        }
      });
    }
  }

  /**
* @description Pagination - Load More Activities Cards on Scroll
* @author Manu Shukla
*/
  onScroll(event: any) {
    const element = event.target as HTMLElement;
    if (element.scrollHeight - element.scrollTop <= element.clientHeight && this.dummyMoviesdata.length < this.totalCount) {
      this.page++
      this.getAllMovies()
    }
  }
}
