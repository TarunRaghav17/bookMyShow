import { Component, OnInit } from '@angular/core';
import { HomeService } from '../service/home.service';
import { forkJoin } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from '../../../../services/common.service';

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
  movieData: any[] = [];
  playsData: any[] = [];
  sportsData: any[] = [];

  visibleData: Record<string, any[]> = {};

  constructor(
    private homeService: HomeService,
    private sanitizer: DomSanitizer,
    public commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.getAllData()
  }


  getVisibleCards(type: string, originalData: any[]) {
    const pageNo = this.pageNoMap[type] ?? 0;
    const start = this.itemsPerCards * pageNo;
    const end = start + this.itemsPerCards;
    this.visibleData[type] = originalData.slice(start, end);
  }


  next(type: string, originalData: any[]) {
    const pageNo = this.pageNoMap[type] ?? 0;
    const start = (pageNo + 1) * this.itemsPerCards;
    if (start < originalData.length) {
      this.pageNoMap[type] = pageNo + 1;
      this.getVisibleCards(type, originalData);
    }
  }


  prev(type: string, originalData: any[]) {
    const pageNo = this.pageNoMap[type] ?? 0;
    if (pageNo > 0) {
      this.pageNoMap[type] = pageNo - 1;
      this.getVisibleCards(type, originalData);
    }
  }

  getAllData() {
    const types = ['Movie', 'Plays', 'Sports', 'Activities'];

    forkJoin(types.map(type => this.homeService.getEventListByType(type)))
      .subscribe({
        next: (results) => {
          const [Movie, Plays, Sports, Activities] = results;
          this.movieData = Movie?.data
          this.playsData = Plays?.data;
          this.sportsData = Sports?.data;
          this.activiesData = Activities?.data;
          types.forEach(type => this.pageNoMap[type] = 0);

          this.getVisibleCards('Movie', this.movieData);
          this.getVisibleCards('Plays', this.playsData);
          this.getVisibleCards('Sports', this.sportsData);
          this.getVisibleCards('Activities', this.activiesData);
        },
        error: (err) => console.error(err)
      });
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

}
