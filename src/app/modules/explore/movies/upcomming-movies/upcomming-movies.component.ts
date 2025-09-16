import { Component } from '@angular/core';
import { movies, selectedFilters} from '../../../../../../db';
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
  dummyMoviesdata: any[] = [];
  selectedFilters: any[] = []
  selectedCity: any = null
  topFiltersArray!: any[]
  originalMovies = movies;
  filters: any[] = []
  select: any[] = selectedFilters
  filtersArray: any[] = []

  constructor(public commonService: CommonService, private movieService: MovieService, private toastr: ToastrService) {
    this.selectedCity = this.commonService._selectCity()
    this.commonService._selectedCategory.set('Movies');
  }
  ngOnInit(): void {
    this.setFilter()
    this.movieService.getFilters('languages').subscribe({
      next: (res) => {
        this.topFiltersArray = res.data
      },
      error: (res) => {
        this.toastr.error(res.message);
      }
    })
    this.movieService.getAllMovies().subscribe({
      next: (res) => {
        this.dummyMoviesdata = res.data
      },
      error: () => {
        this.toastr.error("Failed To Fetch upcoming Movies");
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
        this.filters = [
          { type: 'Language', data: languages.data },
          { type: 'Genres', data: genres.data },
          { type: 'Tags', data: tags.data },
          { type: 'Formats', data: formats.data },
          { type: 'Release Month', data: releaseMonth.data }
        ];
      },
      error: (res) => {
        this.toastr.error(res.message);
      }
    });
  }
}
