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
  totalItemsPerPage = 20;
  itemPerType = this.totalItemsPerPage / 5
  totalContentCount = 0;


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
    this.fetchContentsList()
  }
  /**
   * @description function that fetch contents list .
   * @author Inzamam
   * @returnType void
   */
  fetchContentsList() {
    forkJoin([
      this.contentsService.getContentsList('Movie', this.currentPage, this.itemPerType),
      this.contentsService.getContentsList('Plays', this.currentPage, this.itemPerType),
      this.contentsService.getContentsList('Sports', this.currentPage, this.itemPerType),
      this.contentsService.getContentsList('Activities', this.currentPage, this.itemPerType),
      this.contentsService.getContentsList('Event', this.currentPage, this.itemPerType),
    ]
    ).subscribe({
      next: (
        [Movie, Plays, Sports, Activities, Event]) => {
        this.contentsList =
          [{ type: 'Movie', data: Movie.data.content, count: Movie.data.count },
          { type: 'Plays', data: Plays.data.content, count: Plays.data.count },
          { type: 'Sports', data: Sports.data.content, count: Sports.data.count },
          { type: 'Activities', data: Activities.data.content, count: Activities.data.count },
          { type: 'Event', data: Event.data.content, count: Event.data.count }];
        this.totalContentCount = Movie.data.count + Plays.data.count + Sports.data.count + Activities.data.count + Event.data.count
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
    if (event.target.checked) {
      this.userSelectedType.push(event.target.value);
    } else {
      this.userSelectedType = this.userSelectedType.filter((item: any) => item != event.target.value)
    }
    this.handleFilteredVenuesList()
  }


  /**
 * @description function that calls every time admin select any content type.
 * @author Inzamam
 * @returnType void
 */
  handleFilteredVenuesList() {
    this.filteredContentList = [];
    this.userSelectedType.forEach((type: any) => {
      this.contentsService
        .getContentsList(type, this.currentPage, Math.floor(this.totalItemsPerPage / this.userSelectedType.length))
        .subscribe({
          next: (res: any) => {
            this.filteredContentList.push({
              type,
              data: res.data.content
            });
            this.totalContentCount = res.data.count;
          },
          error: (err) => {
            this.toaster.error(err.error.message)
          }
        });
    });
  }
  /**
   * @description getter function to get total no of pages .
   * @author Inzamam
   * @returnType Number
   */
  get totalPages() {
    return Math.ceil(this.totalContentCount / this.totalItemsPerPage);
  }

  /**
 * @description function that allows to change page .
 * @author Inzamam
 * @param page no set to current page & calls handleFilteredVenuesList or fetchContentsList
 * @returnType void
 */
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
    this.userSelectedType.length > 0 ? this.handleFilteredVenuesList() : this.fetchContentsList()
  }

  /**
   * @description function that allows to change page size .
   * @author Inzamam
   * @param event
   * @returnType void
   */
  handlePageSizeChange(event: any) {
    this.totalItemsPerPage = Number(event.target.value)
    this.itemPerType = this.totalItemsPerPage / 5

    if (this.userSelectedType.length > 0) this.handleFilteredVenuesList()
      
    else this.fetchContentsList()
  }


}
