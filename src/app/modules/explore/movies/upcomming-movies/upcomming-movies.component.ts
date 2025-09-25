import { Component } from '@angular/core';
import { movies, selectedFilters } from '../../../../../../db';
import { CommonService } from '../../../../services/common.service';
import { forkJoin } from 'rxjs';
import { MovieService } from '../service/movie-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-upcomming-movies',
  standalone: false,
  templateUrl: './upcomming-movies.component.html',
  styleUrl: './upcomming-movies.component.scss'
})
export class UpcommingMoviesComponent {
  dummyMoviesdata: any[] |null = null
  selectedFilters: any[] = []
  selectedCity: any = null
  topFiltersArray!: any[]
  originalMovies = movies;
  filters: any[] = []
  select: any[] = selectedFilters
  filtersArray: any[] = []
  sendPayload: any = {
    "type": "string",
    "languages": [],
    "genres": [],
    "formats": [],
    "tags": [],
    "releaseMonths": [],
    "dateFilters": []
  }

  constructor(public commonService: CommonService, private movieService: MovieService, private toastr: ToastrService) {
    this.selectedCity = this.commonService._selectCity()
    this.commonService._selectedCategory.set('Movies');
  }
  ngOnInit(): void {
    this.setFilter()
    this.sendPayload.type = 'Movie'
    this.getAllUpcomingMovies()
   
  }
  getAllUpcomingMovies(){
     this.movieService.getAllMovies(this.sendPayload).subscribe({
      next: (res) => {
        this.dummyMoviesdata = res.data || []
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
     this.getAllUpcomingMovies()
    this.commonService.handleEventFilter(event)
  }

  clearFilter(item:any){
    if(!item) return
    switch(item){
       case 'Language':
        this.sendPayload.languages =[]
        break;

      case 'Genres':
       this.sendPayload.genres =[]
        break;

      case 'Formats':
        this.sendPayload.formats =[]
        break;

      case 'Tags':
       this.sendPayload.tags =[]
        break;

      case 'Release Month':
        this.sendPayload.releaseMonths =[]
        break;
    }
    this.getAllUpcomingMovies()
  }
}
