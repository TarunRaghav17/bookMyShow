import { Component } from '@angular/core';
import { movies, selectedFilters } from '../../../../../../db';
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
  originalMovies = movies;
  filters: any[] = []
  select: any[] = selectedFilters
  filtersArray: any[] = []
  page: number = 0
  size: number = 8
  shouldCallAPI: boolean = false
  sendPayload: any = {
    "type": "string",
    "languages": [],
    "genres": [],
    "formats": [],
    "tags": [],
    "releaseMonths": [],
    "dateFilters": []
  }

  constructor(public commonService: CommonService, private movieService: MovieService, private toastr: ToastrService, public loaderService: LoaderService) {
    this.selectedCity = this.commonService._selectCity()
    this.commonService._selectedCategory.set('Movies');
  }
  ngOnInit(): void {
    this.setFilter()
    this.sendPayload.type = 'Movie'
    this.getAllUpcomingMovies()

  }
  getAllUpcomingMovies() {
    this.movieService.getAllMovies(this.sendPayload, this.page, this.size).subscribe({
      next: (res) => {
        let resData = res.data.content
        this.dummyMoviesdata = [...this.dummyMoviesdata, ...resData].flat()
      },
      error: (err) => {
        this.toastr.error(err.message);
      }
    })
  }
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
    if(this.shouldCallAPI){
      this.page = 0;
      this.dummyMoviesdata = [];
      this.getAllUpcomingMovies();
    }
  }

  onScroll(event: any) {
    const element = event.target as HTMLElement;
    if (element.scrollHeight - element.scrollTop <= element.clientHeight) {
      this.page++
      this.getAllUpcomingMovies()
    }
  }
}
