import { Component } from '@angular/core';
import { movies, selectedFilters, topFilters } from '../../../../../../db';
import { CommonService } from '../../../../services/common.service';
import { forkJoin } from 'rxjs';
import { MovieService } from '../movie-service.service';

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
  topFiltersArray: any[] = topFilters
  originalMovies = movies;
  filters: any[] = []
  select: any[] = selectedFilters
  filtersArray:any[]=[]

  constructor(public commonService: CommonService, private movieService:MovieService) {
    this.selectedCity = this.commonService._selectCity()
    this.commonService._selectedCategory.set('Movies');
  }
  ngOnInit(): void {
      this.setFilter()
      this.movieService.getAllMovies().subscribe((res)=>{
      this.dummyMoviesdata = res.data
     })
  }
  setFilter() {
    forkJoin([
      this.movieService.getFilters('languages'),
      this.movieService.getFilters('formats'),
      this.movieService.getFilters('genres')
    ]).subscribe(([languages, formats, genres]) => {
      this.filters = [{type:'Language',data:languages.data}, {type:'Formats', data:formats.data}, {type:'Genres', data:genres.data}];
    });
  }

}
