import { Component } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-buy-tickets',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './buy-tickets.component.html',
  styleUrl: './buy-tickets.component.scss'
})
export class BuyTicketsComponent {

  constructor(public commonService: CommonService,
  ) { }

  selectedMovie = 'movie999'
  movieDetails: any = {}
  dateSelectionArray: any = []
  myMovies = [
    {
      "_id": "movie001",
      "title": "Avengers: Endgame",
      "language": "English",
      "genre": ["Action", "Adventure"],
      "duration": 181,
      "releaseDate": "2019-04-26"
    },
    {
      "_id": "movie002",
      "title": "Pathaan",
      "language": "Hindi",
      "genre": ["Action", "Thriller"],
      "duration": 146,
      "releaseDate": "2023-01-25"
    },
    {
      "_id": "movie003",
      "title": "RRR",
      "language": "Telugu",
      "genre": ["Drama", "Action"],
      "duration": 187,
      "releaseDate": "2022-03-25"
    }
  ];



  theatres = [
    {
      "_id": "theatre001",
      "name": "PVR Pacific Mall",
      "cityId": "delhi123",
      "screens": [
        {
          "screenId": "screen1",
          "name": "Screen 1",
          "layout": [
            { "seatId": "A1", "row": "A", "number": 1, "category": "Platinum" },
            { "seatId": "A2", "row": "A", "number": 2, "category": "Platinum" },
            { "seatId": "B1", "row": "B", "number": 1, "category": "Gold" },
            { "seatId": "B2", "row": "B", "number": 2, "category": "Gold" }
          ]
        },
        {
          "screenId": "screen2",
          "name": "Screen 2",
          "layout": [
            { "seatId": "C1", "row": "C", "number": 1, "category": "Silver" },
            { "seatId": "C2", "row": "C", "number": 2, "category": "Silver" }
          ]
        }
      ]
    },
    {
      "_id": "theatre002",
      "name": "INOX City Center",
      "cityId": "mumbai123",
      "screens": [
        {
          "screenId": "screen1",
          "name": "Screen 1",
          "layout": [
            { "seatId": "A1", "row": "A", "number": 1, "category": "Platinum" },
            { "seatId": "A2", "row": "A", "number": 2, "category": "Platinum" },
            { "seatId": "B1", "row": "B", "number": 1, "category": "Gold" },
            { "seatId": "B2", "row": "B", "number": 2, "category": "Gold" }
          ]
        }
      ]
    },

    {
      "_id": "theatre003",
      "name": "PVR Pacific Mall New",
      "cityId": "delhi123",
      "screens": [
        {
          "screenId": "screen1",
          "name": "Screen 1",
          "layout": [
            { "seatId": "A1", "row": "A", "number": 1, "category": "Platinum" },
            { "seatId": "A2", "row": "A", "number": 2, "category": "Platinum" },
            { "seatId": "B1", "row": "B", "number": 1, "category": "Gold" },
            { "seatId": "B2", "row": "B", "number": 2, "category": "Gold" }
          ]
        },
        {
          "screenId": "screen2",
          "name": "Screen 2",
          "layout": [
            { "seatId": "C1", "row": "C", "number": 1, "category": "Silver" },
            { "seatId": "C2", "row": "C", "number": 2, "category": "Silver" }
          ]
        }
      ]
    },

  ];

  shows = [
    {
      "_id": "show001",
      "theatreId": "theatre001",
      "screenId": "screen1",
      "movieId": "movie456",
      "date": "2025-09-01",
      "time": "18:30",
      "language": "English",
      "format": "IMAX 3D",
      "price": {
        "Platinum": 500,
        "Gold": 350,
        "Silver": 250
      },
      "bookedSeats": ["A2", "B5", "C3"],
      "status": "active"
    },
    {
      "_id": "show002",
      "theatreId": "theatre002",
      "screenId": "screen1",
      "movieId": "movie789",
      "date": "2025-09-01",
      "time": "21:30",
      "language": "Hindi",
      "format": "2D",
      "price": {
        "Platinum": 400,
        "Gold": 300,
        "Silver": 200
      },
      "bookedSeats": ["A1", "A3", "D2"],
      "status": "active"
    },
    {
      "_id": "show003",
      "theatreId": "theatre003",
      "screenId": "screen2",
      "movieId": "movie999",
      "date": "2025-09-02",
      "time": "15:00",
      "language": "Telugu",
      "format": "3D",
      "price": {
        "Platinum": 450,
        "Gold": 320,
        "Silver": 220
      },
      "bookedSeats": ["B1", "B4", "C5"],
      "status": "active"
    },
    {
      "_id": "show004",
      "theatreId": "theatre001",
      "screenId": "screen2",
      "movieId": "movie999",
      "date": "2025-09-02",
      "time": "15:00",
      "language": "Telugu",
      "format": "3D",
      "price": {
        "Platinum": 450,
        "Gold": 320,
        "Silver": 220
      },
      "bookedSeats": ["B1", "B4", "C5"],
      "status": "active"
    }
  ]

  ngOnInit() {
    this.movieDetails = this.commonService.movieDetails()

    this.initializeDateSelectionArray()
    this.commonService.setUserSelectedDate(this.dateSelectionArray[0])
    console.log( this.commonService.getUserSelectedDate())

    this.theatres.map((theatre: any) => {
      // get only shows belonging to this theatre
      let theatreShows = this.shows.filter((show: any) => show.theatreId === theatre._id && show.movieId === this.selectedMovie);

      // return theatre with its shows
      return {
        ...theatre,
        shows: theatreShows
      }

    });



  }


  initializeDateSelectionArray() {
    let today = new Date();
    for (let i = 0; i < 7; i++) {
      let dateObj = new Date();
      dateObj.setDate(today.getDate() + i)
      this.dateSelectionArray.push({
        day: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
        dateNum: dateObj.getDate(),
        month: dateObj.toLocaleDateString('en-US', { month: 'short' })
      })
    }
  }



}
