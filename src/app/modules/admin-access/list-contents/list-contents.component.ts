import { Component, OnInit, } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ListContentsService } from './list-content-service/list-contents.service';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-list-contents',
  standalone: false,
  templateUrl: './list-contents.component.html',
  styleUrl: './list-contents.component.scss'
})
export class ListContentsComponent implements OnInit {

  contentsList: any[] = [];
  userSelectedType: any[] = [];
  filteredContentList: any[] = [];
  currentPage = 1;
  filtersCurrentPage = 1;
  totalItemsPerPage = 20;
  itemPerType = this.totalItemsPerPage / 5
  totalContentCount = 0;
  isEnd: boolean = false;
  isLoading = false;
  loadedFilteredCounts: any;

  constructor(private titleService: Title,
    private contentsService: ListContentsService,
    private toaster: ToastrService,
    public commonService: CommonService,
  ) { }
  /**
   * @description life cycle hook  that sets title of page ,calls fetchContentsList 
   * @author Inzamam
   * @param event
   * @returnType void
   */
  ngOnInit() {
    this.titleService.setTitle('Contents List')
    this.fetchContentsList();
  }
  ngOnDestroy() {
    this.titleService.setTitle('Book-My-Show');
  }
  /**
   * @description function that fetch contents list .
   * @author Inzamam
   * @returnType void
   */
  fetchContentsList() {
    forkJoin([
      this.contentsService.getContentsList('Movie', this.currentPage, this.itemPerType, false),
      this.contentsService.getContentsList('Movie', this.currentPage, this.itemPerType),
      this.contentsService.getContentsList('Plays', this.currentPage, this.itemPerType),
      this.contentsService.getContentsList('Sports', this.currentPage, this.itemPerType),
      this.contentsService.getContentsList('Activities', this.currentPage, this.itemPerType),
      this.contentsService.getContentsList('Event', this.currentPage, this.itemPerType),
    ]
    ).subscribe({
      next: (
        [upcomingMovie, Movie, Plays, Sports, Activities, Event]) => {
        this.isLoading = false;
        this.contentsList = [...this.contentsList,
        [
          { type: 'upcomingMovie', data: upcomingMovie.data.content, count: upcomingMovie.data.count },
          { type: 'Movie', data: Movie.data.content, count: Movie.data.count },
          { type: 'Plays', data: Plays.data.content, count: Plays.data.count },
          { type: 'Sports', data: Sports.data.content, count: Sports.data.count },
          { type: 'Activities', data: Activities.data.content, count: Activities.data.count },
          { type: 'Event', data: Event.data.content, count: Event.data.count }]].flat();
        this.totalContentCount = upcomingMovie.data.count + Movie.data.count + Plays.data.count + Sports.data.count + Activities.data.count + Event.data.count
      },
      error: (err) => {
        this.toaster.error(err.error.message)
      }
    })
  }
  /**
   * @description function that allows to select / deselect content type .
   * @author Inzamam
   * @param event
   * @returnType void
   */
  toggleType(event: any) {
    this.currentPage = 1;
    this.filtersCurrentPage = 1;
    this.filteredContentList = [];
    if (event.target.checked) {
      this.userSelectedType.push(event.target.value);
    } else {
      this.userSelectedType = this.userSelectedType.filter((item: any) => item != event.target.value)
    }
    this.handleFilteredContentList()
  }

  /**
 * @description function that calls every time admin select any content type.
 * @author Inzamam
 * @returnType void
 */
  totalFilteredCounts = 0;
  handleFilteredContentList() {
    if (this.userSelectedType.length === 0) {
      this.filteredContentList = [];
      return;
    }
    const requests = this.userSelectedType.flatMap((type: any) => {
      if (type == 'Movie') {
        return [
          this.contentsService.getContentsList(
            type,
            this.filtersCurrentPage,
            Math.floor(this.totalItemsPerPage / this.userSelectedType.length)
          ),
          this.contentsService.getContentsList(
            type,
            this.filtersCurrentPage,
            Math.floor(this.totalItemsPerPage / this.userSelectedType.length), false
          )
        ]

      }
      else {
        return this.contentsService.getContentsList(
          type,
          this.filtersCurrentPage,
          Math.floor(this.totalItemsPerPage / this.userSelectedType.length)
        )
      }

    }

    );
    this.isLoading = true;
    forkJoin(requests).subscribe({
      next: (responses: any[]) => {
        this.isLoading = false;
        responses.forEach((res, index) => {
          const type = this.userSelectedType[index] ?? "upcomingMovie";
          if (res.data.content.length > 0) {
            const existing = this.filteredContentList.find(c => c.type === type);
            if (existing) {
              existing.data = [...existing.data, ...res.data.content];
            } else {
              this.filteredContentList.push({
                type,
                data: res.data.content
              });
            }
          }
        });

        this.totalFilteredCounts = responses.reduce(
          (sum, res) => sum + res.data.count,
          0
        );

        this.loadedFilteredCounts = this.filteredContentList.reduce(
          (sum, res) => sum + res.data.length,
          0
        );
      },
      error: (err) => {
        this.isLoading = false;
        this.toaster.error(err.error.message);
      }
    });
  }

  dataLoadedCount: number = 0

  /**
* @description function that gets invokes every time WE scroll to bottom of page.
* @author Inzamam
* @params scroll event
*/
  onCardContainerScroll(event: any) {

    const element = event.target as HTMLElement;
    this.dataLoadedCount = this.contentsList.reduce(
      (total: number, content: any) => total + content.data.length,
      0
    );
    this.isEnd = this.userSelectedType.length > 0 ? this.loadedFilteredCounts >= this.totalFilteredCounts : this.dataLoadedCount >= this.totalContentCount

    if (!this.isLoading && element.scrollTop + element.clientHeight + 300 >= element.scrollHeight && !this.isEnd) {
      this.isLoading = true;
      if (this.userSelectedType.length > 0) {
        this.filtersCurrentPage++
        this.handleFilteredContentList();
      }
      else {
        this.currentPage++;
        this.fetchContentsList();
      }
    }
  }

}




