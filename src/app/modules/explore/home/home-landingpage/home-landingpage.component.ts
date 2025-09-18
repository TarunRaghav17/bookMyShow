import { Component, OnInit } from '@angular/core';
import { HomeService } from '../service/home.service';
import { forkJoin } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from '../../../../services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home-landingpage.component.html',
  styleUrl: './home-landingpage.component.scss',
})
export class HomeLandingPageComponent implements OnInit {
  pageNoMap: Record<string, number | undefined> = {};
  itemsPerCards = 5;
  activiesData: any[] = [];
  eventsData: any[] = [];
  movieData: any[] = [];
  playsData: any[] = [];
  sportsData: any[] = [];
  selectedCategory: string = '';
  visibleData: Record<string, any[]> = {};
  translateXMap: Record<string, number> = {};
  visibleCount = this.itemsPerCards;

  constructor(
    private homeService: HomeService,
    private sanitizer: DomSanitizer,
    public commonService: CommonService,
    private toastr: ToastrService
  ) {
    this.selectedCategory = this.commonService._selectedCategory();
  }

  ngOnInit(): void {
    this.getAllData();
  }

  /**
   * @description Get paginated (visible) cards for a specific event type
   * @param type Event type (Movie, Plays, Sports, Activities)
   * @param originalData Full dataset for the given type
   */
  getVisibleCards(type: string, originalData: any[]) {
    const pageNo = this.pageNoMap[type] ?? 0;
    const start = this.itemsPerCards * pageNo;
    const end = start + this.itemsPerCards;
    this.visibleData[type] = originalData.slice(start, end);
    this.updateTransform(type);
  }

  /**
   * @description Move to the next page of cards for the given type
   * @param type Event type
   * @param originalData Full dataset
   */
  next(type: string, originalData: any[]) {
    const pageNo = this.pageNoMap[type] ?? 0;
    const start = (pageNo + 1) * this.itemsPerCards;
    if (start < originalData.length) {
      this.pageNoMap[type] = pageNo + 1;
      this.getVisibleCards(type, originalData);
    }
  }

  /**
   * @description Move to the previous page of cards for the given type
   * @param type Event type
   * @param originalData Full dataset
   */
  prev(type: string, originalData: any[]) {
    const pageNo = this.pageNoMap[type] ?? 0;
    if (pageNo > 0) {
      this.pageNoMap[type] = pageNo - 1;
      this.getVisibleCards(type, originalData);
    }
  }
  /**
   * @description Fetch event data for all types and initialize pagination
   */
  getAllData() {
    const types = ['Movie', 'Plays', 'Sports', 'Activities', 'Event'];
    forkJoin(
      types.map((type) => this.homeService.getEventListByType(type))
    ).subscribe({
      next: (results) => {
        const [movie, plays, sports, activities, events] = results;
        this.movieData = movie?.data;
        this.playsData = plays?.data;
        this.sportsData = sports?.data;
        this.activiesData = activities?.data;
        this.eventsData = events?.data;
        types.forEach((type) => (this.pageNoMap[type] = 0));
        this.getVisibleCards('Movie', this.movieData);
        this.getVisibleCards('Plays', this.playsData);
        this.getVisibleCards('Sports', this.sportsData);
        this.getVisibleCards('Activities', this.activiesData);
        this.getVisibleCards('Event', this.eventsData);
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    });
  }

  /**
   * @description Convert base64 string to a safe image URL
   * @param base64string Base64 string
   * @returns Safe image URL
   */
  getImageFromBase64(base64string: string): any {
    if (base64string) {
      const fullBase64String = `data:${base64string};base64,${base64string}`;
      return this.sanitizer.bypassSecurityTrustUrl(fullBase64String);
    }
  }

  /**
   * @description Update transform for sliding effect
   */
  updateTransform(type: string) {
    const pageNo = this.pageNoMap[type] ?? 0;
    const shift = -(pageNo * (100 / this.visibleCount));
    this.translateXMap[type] = shift;
  }
}
