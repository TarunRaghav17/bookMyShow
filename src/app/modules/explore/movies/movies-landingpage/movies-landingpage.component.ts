import { Component, OnDestroy } from '@angular/core';
import { movies, selectedFilters } from '../../../../../../db';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { MovieService } from '../movie-service.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-movie',
  standalone: false,
  templateUrl: './movies-landingpage.component.html',
  styleUrl: './movies-landingpage.component.scss'
})
export class MovieLandingPageComponent implements OnDestroy {
  dummyMoviesdata: any[] = [];
  selectedCity: any = null
  topFiltersArray!: any[] 
  filtersArray:any[]=[]
  originalMovies = movies;
  filters: any[] = this.filtersArray
  select: any[] = selectedFilters

  constructor(public commonService: CommonService, public router: Router, private movieService:MovieService) {
 
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

  /**
* @description Remove Already Selected Filters
* @author Manu Shukla
* @params  
* @returnType void
*/

  ngOnDestroy(): void {
    this.commonService.resetfilterAccordian(this.filters)
  }
}
