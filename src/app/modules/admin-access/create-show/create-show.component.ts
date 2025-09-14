import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { contents } from '../../../../../db';
import { VenuesService } from '../create-venue/venues-services/venues.service';
import { ShowsService } from './shows-services/shows.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  standalone: false,
  selector: 'app-show-form',
  templateUrl: './create-show.component.html',
  styleUrls: ['./create-show.component.scss']
})
export class CreateShowComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private venuesService: VenuesService,
    private toaster: ToastrService,
    private showService: ShowsService,
    
  ) { }

  contents!:any[]

  minDate = ""
  minTime = ""
  venues = [];
  selectedVenueObj: any[] = [];
  showForm!: FormGroup;

  venuesNameList: any[] = [];
  eventsNameList: any[] = [];
  languagesArray: any[] = [];
  formatsArray: any[] = [];
  screenNamesArray: any[] = [];
  statusArray: any[] = [];


  ngOnInit(): void {
    this.showForm = this.fb.group({
      eventName: ['', Validators.required],
      venueName: ['', Validators.required],
      eventType: ['', Validators.required],  // movies | sports | events | activities
      city: ['', Validators.required],
      date: ['', Validators.required],       // YYYY-MM-DD
      startTime: ['', Validators.required],  // HH:mm
      duration: [null, [Validators.required, Validators.min(1)]],

      language: ['', Validators.required],
      


      // categories: this.fb.array([]),

      status: ['', Validators.required]      // active | cancelled | completed | ongoing
    });


    this.setToday()

    this.showService.getContents().subscribe((res) => {
      this.contents=res
      
    })
  }




  // Getter for categories array
  get categories(): FormArray {
    return this.showForm.get('categories') as FormArray;
  }

  getRows(layout: AbstractControl): number {
    return ((layout.get('rows') as FormArray).value).length
  }

  onEventTypeChange() {
    this.handleReset(['city', 'status', 'venueName', 'eventName'])
    // this.showForm.get('status')?.setValue('')
    let selectedEventType = this.showForm.get('eventType')?.value
    if (selectedEventType != 'movies') {
      this.showForm.addControl('reservedSeats', this.fb.array([
        this.fb.group({
          userId: ["1245", Validators.required],
          userReservationSeats: [["A-01", "A-02"], Validators.required],


        })

      ]));
      this.showForm.addControl('price', this.fb.control(0, Validators.required));
      this.showForm.removeControl('categories');
      this.showForm.removeControl('format')
      this.showForm.removeControl('screenName')
      this.statusArray = [
        "active",
        "cancelled",
        "completed",
        "ongoing",
      ]

    }
    else {
      this.statusArray = [
        "upcoming", "released"
      ]
      this.showForm.addControl('categories', this.fb.array([]));
      this.showForm.removeControl('reservedSeats');
      this.showForm.removeControl('price')
      this.showForm.addControl('format',this.fb.control('',Validators.required));
      this.showForm.addControl('screenName',this.fb.control('',Validators.required));
   

    }
  }

  // Add category group
  addCategory(): void {
    const categoryGroup = this.fb.group({
      category: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      totalSeats: [null, [Validators.required, Validators.min(1)]],
      reservedSeats: this.fb.array([])
    });

    this.categories.push(categoryGroup);
  }

  // Getter for reservedSeats inside a category
  getReservedSeats(index: number): FormArray {
    return this.categories.at(index).get('reservedSeats') as FormArray;
  }

  // Add reserved seat into a specific category
  addReservedSeat(categoryIndex: number): void {
    const reservedSeatGroup = this.fb.group({
      seatId: ['', Validators.required],
      status: ['', Validators.required], // reserved | booked | blocked
      userId: ['', Validators.required],
      timestamp: ['', Validators.required],
      holdExpiry: [''] // optional
    });

    this.getReservedSeats(categoryIndex).push(reservedSeatGroup);
  }

  onSubmit(): void {
    // if (this.showForm.valid) {
    console.log('Form Value:', this.showForm.value);
    this.showService.createShow(this.showForm.value).subscribe({
      next: (res) => {
        console.log(res)
        this.toaster.success('Show created successfully')
      },
      error: (err) => {
        console.log(err)
        this.toaster.error(err.message)
      }

    })
    // } else {
    //   console.log('Form Invalid');
    //   this.showForm.markAllAsTouched();
    // }
  }

  onCityChange() {
    let selectedEventType = this.showForm.get('eventType')?.value
    let selectedCity = this.showForm.get('city')?.value
    this.venuesService.getVenues().subscribe({
      next: (res) => {
        this.venuesNameList = res.filter((venue: any) => {
          if (venue.address.city.toLowerCase() == selectedCity.toLowerCase() &&
            venue.venueFor.toLowerCase() == selectedEventType.toLowerCase()) return venue

        });
      },
      error: (err) => {
        console.log(err)
      }
    })

  }



  onVenueNameChange() {
    const selectedEventType = this.showForm.get('eventType')?.value;
    const selectedVenueName = this.showForm.get('venueName')?.value;


    this.selectedVenueObj = this.venuesNameList.filter(
      (venue) => venue.venueName === selectedVenueName
    );

    this.screenNamesArray = this.selectedVenueObj[0].screens

    const venue = this.selectedVenueObj[0];

    if (!venue) {
      this.eventsNameList = [];
      return;
    }

    const supportedCategories = venue.supportedCategories.map((cat: string) =>
      cat.toLowerCase()
    );

    console.log(supportedCategories)
    this.formatsArray = supportedCategories

    this.eventsNameList = this.contents.filter((content: any) => {
      console.log(content)

      switch(content.type){

        case 'movies':
          {
 return (
        content.type.toLowerCase() === selectedEventType.toLowerCase() && content.movieDetails.format.some((f: any) =>
          supportedCategories.includes(f.toLowerCase())
        )
      );
      
          }

           case 'events':
          {
 console.log('events called')
        if(content.type.toLowerCase() === selectedEventType.toLowerCase())
          return content
          }







      }
     
      

    });

    console.log(this.eventsNameList)
  }


  onScreenChange(event: any) {
    this.categories.clear();
    let selectedScreen = this.selectedVenueObj[0].screens.find((screen: any) => screen.screenName == event.target.value)
    console.log(selectedScreen, "value")
    if (!selectedScreen) return;

    selectedScreen.layouts.forEach((layout: any) => {
      this.categories.push(this.fb.group({

        layoutName: [layout.layoutName, Validators.required],
        rows: [layout.rows, Validators.required], // you can make it FormArray if needed
        cols: [layout.cols, Validators.required],
        price: ['', Validators.required],
        reservedSeats: this.fb.array([
          this.fb.group({
            userId: ["1245", Validators.required],
            userReservationSeats: [["A-01"], Validators.required],


          })
        ])

      }))


    })


  }







  onEventNameChange() {
    let selectedEventName = this.showForm.get('eventName')?.value



    let selectedEventNameObj = this.eventsNameList.filter((event: any) => event.name == selectedEventName)
    this.languagesArray = selectedEventNameObj[0].language 
  }


  setToday() {
    let today = new Date()
    this.minDate = today.toISOString().split('T')[0]

  }



  handleReset(formControls: any[]) {
    formControls.forEach((ctrl) => {
      this.showForm.get(ctrl)?.reset();
      this.showForm.get(ctrl)?.setValue('')
    })

  }




}