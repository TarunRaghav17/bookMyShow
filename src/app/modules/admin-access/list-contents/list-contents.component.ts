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
cardDetails=
  [
        {
            "contentId": "c001",
            "type": "movies",
            "name": "Avengers: Endgame",
            "description": "The Avengers assemble once more to reverse Thanos' snap.",
            "duration": 180,
            "posterUrl": "https://dummyimage.com/avengers.jpg",
            "status": "running",
            "language": [
                "Hindi",
                "English"
            ],
            "movieDetails": {
                "format": [
                    "2D",
                    "3D",
                    "IMAX"
                ],
                "genres": [
                    "Action",
                    "Sci-Fi"
                ],
                "cast": [
                    "Robert Downey Jr.",
                    "Chris Evans",
                    "Scarlett Johansson"
                ]
            }
        },
        {
            "contentId": "c002",
            "type": "sports",
            "name": "India vs Australia T20",
            "description": "Exciting T20 cricket match at Eden Gardens.",
            "duration": 240,
            "posterUrl": "https://dummyimage.com/cricket.jpg",
            "status": "upcoming",
            "language": [
                "Hindi",
                "English"
            ],
            "sportsDetails": {
                "sportType": "cricket",
                "teams": [
                    "India",
                    "Australia"
                ],
                "league": "International T20"
            }
        },
        {
            "contentId": "c003",
            "type": "activity",
            "name": "Yoga Wellness Workshop",
            "description": "Morning yoga session with a certified instructor.",
            "duration": 90,
            "posterUrl": "https://dummyimage.com/yoga.jpg",
            "status": "upcoming",
            "activityDetails": {
                "category": "workshop",
                "instructor": "Anjali Sharma"
            }
        },
        {
            "contentId": "c004",
            "type": "movies",
            "name": "Oppenheimer",
            "description": "The story of J. Robert Oppenheimer and the creation of the atomic bomb.",
            "duration": 180,
            "posterUrl": "https://dummyimage.com/oppenheimer.jpg",
            "status": "running",
            "language": [
                "Hindi",
                "English"
            ],
            "movieDetails": {
                "format": [
                    "IMAX",
                    "2D"
                ],
                "genres": [
                    "Drama",
                    "History"
                ],
                "cast": [
                    "Cillian Murphy",
                    "Emily Blunt",
                    "Matt Damon"
                ]
            }
        },
        {
            "contentId": "c005",
            "type": "sports",
            "name": "Champions League Final",
            "description": "The grand finale of the UEFA Champions League.",
            "duration": 150,
            "posterUrl": "https://dummyimage.com/ucl.jpg",
            "status": "upcoming",
            "language": [
                "Hindi",
                "English"
            ],
            "sportsDetails": {
                "sportType": "football",
                "teams": [
                    "Real Madrid",
                    "Manchester City"
                ],
                "league": "UEFA Champions League"
            }
        },
        {
            "contentId": "c006",
            "type": "events",
            "name": "Arijit Singh Live Concert",
            "description": "A soulful musical evening with Arijit Singh.",
            "duration": 210,
            "posterUrl": "https://dummyimage.com/concert.jpg",
            "status": "upcoming",
            "language": [
                "Hindi",
                "English"
            ],
            "eventDetails": {
                "category": "concert",
                "performers": [
                    "Arijit Singh"
                ]
            }
        },
        {
            "contentId": "c007",
            "type": "activity",
            "name": "Photography Masterclass",
            "description": "Learn professional photography techniques in this interactive workshop.",
            "duration": 120,
            "posterUrl": "https://dummyimage.com/photography.jpg",
            "status": "upcoming",
            "language": [
                "English",
                "French"
            ],
            "activityDetails": {
                "category": "seminar",
                "instructor": "Ravi Kapoor"
            }
        },
        {
            "contentId": "c008",
            "type": "movies",
            "name": "Inception",
            "description": "A thief who enters dreams to steal secrets gets the toughest mission of his life.",
            "duration": 160,
            "posterUrl": "https://dummyimage.com/inception.jpg",
            "status": "archived",
            "language": [
                "English",
                "French"
            ],
            "movieDetails": {
                "format": [
                    "2D",
                    "IMAX"
                ],
                "genres": [
                    "Sci-Fi",
                    "Thriller"
                ],
                "cast": [
                    "Leonardo DiCaprio",
                    "Joseph Gordon-Levitt",
                    "Elliot Page"
                ]
            }
        },
        {
            "contentId": "c009",
            "type": "events",
            "language": [
                "Hindi",
                "English"
            ],
            "name": "Tech Expo 2025",
            "description": "Annual technology exhibition showcasing latest innovations.",
            "duration": 480,
            "posterUrl": "https://dummyimage.com/techexpo.jpg",
            "status": "upcoming",
            "eventDetails": {
                "category": "exhibition",
                "performers": [
                    "Tech Startups",
                    "Industry Leaders"
                ]
            }
        },
        {
            "contentId": "c010",
            "type": "sports",
            "language": [
                "Hindi",
                "English"
            ],
            "name": "Wimbledon Finals",
            "description": "The prestigious Wimbledon Tennis Championship Finals.",
            "duration": 180,
            "posterUrl": "https://dummyimage.com/wimbledon.jpg",
            "status": "upcoming",
            "sportsDetails": {
                "sportType": "tennis",
                "teams": [
                    "Novak Djokovic",
                    "Carlos Alcaraz"
                ],
                "league": "Grand Slam"
            }
        }
    ]


  contentsList: any[] = [];
  userSelectedType: any[] = [];
  userSelectedView:string='tab'
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


  onTableScroll(event:any){
const element = event.target as HTMLElement;
    if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
    console.log('called')
    }

  }

}
