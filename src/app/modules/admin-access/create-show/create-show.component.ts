import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { VenuesService } from '../create-venue/venues-services/venues.service';
import { ShowsService } from './shows-services/shows.service';
import { ToastrService } from 'ngx-toastr';
import { ContentService } from '../create-content/content-services/content.service';
import { CommonService } from '../../../services/common.service';
@Component({
  standalone: false,
  selector: 'app-show-form',
  templateUrl: './create-show.component.html',
  styleUrls: ['./create-show.component.scss']
})
export class CreateShowComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder,
    private venuesService: VenuesService,
    private contentService: ContentService,
    private showService: ShowsService,
    private toaster: ToastrService,
    private commonService: CommonService
  ) { }

  showForm!: FormGroup;
  contents!: any[]
  minDate = ""
  minTime = ""
  venues = [];
  selectedVenueObj: any[] = [];
  venuesNameList: any[] = [];
  eventsNameList: any[] = [];
  languagesArray: any[] = [];
  formatsArray: any[] = [];
  screenNamesArray: any[] = [];
  statusArray: any[] = [];
  citiesArray: any[] = [];

  ngOnInit(): void {
    this.showForm = this.fb.group({
      eventName: ['', Validators.required],
      venueName: ['', Validators.required],
      eventType: ['', Validators.required],  // movies | sports | events | activities
      city: ['', Validators.required],
      date: ['', Validators.required],
      startTime: ['', [Validators.required, this.validateStartTime()]],
      duration: [null, [Validators.required]],
      language: ['', Validators.required],
      status: ['', Validators.required]
    });

    this.setToday()
     }

  ngOnDestroy() {
    this.commonService.setCategory(null)
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
    this.venuesNameList = []
    this.eventsNameList = []
    this.languagesArray = []
    // api to get cities
    this.commonService.getAllCities().subscribe(
      (res) => this.citiesArray = res.data)
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
      this.showForm.addControl('format', this.fb.control('', Validators.required));
      this.showForm.addControl('screenName', this.fb.control('', Validators.required));
    }
  }

  onCityChange() {
    let selectedEventType = this.showForm.get('eventType')?.value
    let selectedCity = this.showForm.get('city')?.value
    this.handleReset(['venueName', 'eventName'])
    this.venuesNameList = []
    this.eventsNameList = []
    this.languagesArray = []
    this.venuesService.getVenues().subscribe({
      next: (res) => {
        this.venuesNameList = res.filter((venue: any) => {
          if (venue.address.city.toLowerCase() == selectedCity.toLowerCase() &&
            venue.venueFor.toLowerCase() == selectedEventType.toLowerCase()) {
            return venue
          }
        });
      },
      error: (err) => {
        this.toaster.error(err)
      }
    })
  }

  onVenueNameChange() {
    // const selectedEventType = this.showForm.get('eventType')?.value;
    const selectedVenueName = this.showForm.get('venueName')?.value;
    this.handleReset(['eventName'])
    this.contentService.getContentByType('Movie').subscribe((res) => this.eventsNameList = res.data
    )
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
    this.formatsArray = supportedCategories

  }

  onEventNameChange() {
    let selectedEventName = this.showForm.get('eventName')?.value
    let selectedEventNameObj = this.eventsNameList.find((event: any) => event.name == selectedEventName)
    this.languagesArray = selectedEventNameObj.languages
    if (selectedEventNameObj.releasedFlag) {
      this.showForm.get('status')?.setValue('released')
    }
    else {
      this.showForm.get('status')?.setValue('upcoming')
    }
  }
  setToday() {
    let today = new Date()
    this.minDate = today.toISOString().split('T')[0]
  }

  validateStartTime(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const form = control.parent as FormGroup;
      if (!form) return null; // in case it's not ready yet

      const selectedDate = form.get('date')?.value;
      const selectedTime = control?.value;

      if (!selectedDate || !selectedTime) return null;

      const today = new Date();
      const selectedDateObj = new Date(selectedDate);

      if (selectedDateObj.toDateString() === today.toDateString()) {
        const [hours, minutes] = selectedTime.split(':').map(Number);
        const selectedDateTime = new Date(selectedDateObj);
        selectedDateTime.setHours(hours, minutes, 0, 0);
        if (selectedDateTime < today) {
          return { inValidStartTime: true };
        }
      }
      return null;
    };
  }

  onScreenChange(event: any) {
    this.categories.clear();
    let selectedScreen = this.selectedVenueObj[0].screens.find((screen: any) => screen.screenName == event.target.value)
    if (!selectedScreen) return;
    selectedScreen.layouts.forEach((layout: any) => {
      this.categories.push(this.fb.group({
        layoutName: [layout.layoutName, Validators.required],
        rows: [layout.rows, Validators.required],
        cols: [layout.cols, Validators.required],
        price: ['', Validators.required],
        reservedSeats: this.fb.array([
        ])
      }))
    })
  }

  onSubmit(): void {
    if (this.showForm.valid) {
      this.showService.createShow(this.showForm.value).subscribe({
        next: () => {
          this.toaster.success('Show created successfully')
        },
        error: (err) => {
          this.toaster.error(err.error.message)
        }
      })
    } else {
      this.toaster.error('Form Invalid Please check all fields')
      this.showForm.markAllAsTouched();
    }
  }
  // utility funct. to reset form controls 
  // takes array of form-control names to reset 
  handleReset(formControls: any[]) {
    formControls.forEach((ctrl) => {
      this.showForm.get(ctrl)?.reset();
      this.showForm.get(ctrl)?.setValue('')
    })
  }

}