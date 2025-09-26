import { Component, OnDestroy } from '@angular/core';
import { movies, selectedFilters } from '../../../../../../db';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { MovieService } from '../service/movie-service.service';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-movie',
  standalone: false,
  templateUrl: './movies-landingpage.component.html',
  styleUrl: './movies-landingpage.component.scss'
})
export class MovieLandingPageComponent implements OnDestroy {
  dummyMoviesdata: any[] =[]
  selectedCity: any = null
  topFiltersArray!: any[]
  filtersArray: any[] = []
  originalMovies = movies;
  select: any[] = selectedFilters
  page:number = 0;
  size:number = 5;
  sendPayload: any = {
    "type": "string",
    "languages": [],
    "genres": [],
    "formats": [],
  }

  constructor(public commonService: CommonService, public router: Router, private movieService: MovieService, private toastr: ToastrService) {
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
    this.getAllMovies()
    this.commonService.handleEventFilter(event)
  }

  clearFilter(item: any) {
    if (!item) return;
    switch (item) {
      case 'Language':
        this.sendPayload.languages = [];
        break;
      case 'Genres':
        this.sendPayload.genres = [];
        break;
      case 'Formats':
        this.sendPayload.formats = [];
        break;
    }
    this.getAllMovies()
  }

  getAllMovies(page? :number,size? :number){ {
    this.movieService.getAllMovies(this.sendPayload,page,size).subscribe({
      next: (res) => {
        let resData = res.data.content
        this.dummyMoviesdata = [...this.dummyMoviesdata,...resData].flat() 
            console.log(this.dummyMoviesdata)
      },
      error: (err) => {
        this.toastr.error(err.message);
      }
    });
  }
}

   onScroll(event:any) {
     const element = event.target as HTMLElement;
    if (element.scrollHeight - element.scrollTop <= element.clientHeight) {
     this.page++
   this.getAllMovies(this.page)
    }
  }
}
