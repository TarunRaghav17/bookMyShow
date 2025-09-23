import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ContentService } from './content-services/content.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { VenuesService } from '../create-venue/venues-services/venues.service';
import { ShowsService } from '../create-show/shows-services/shows.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-create-content',
  templateUrl: './create-content.component.html',
  standalone: false
})
export class CreateContentComponent implements OnInit {





  eventForm!: FormGroup;

  selectedEventType: string | null = null;
  // languagesArray: any
  genresArray: any;
  // formatsArray: any;
  tagsArray: any;
  categoriesArray: any;
  moreFilters: any;



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
  screensArray: any[] = [];
  statusArray: any[] = [
    "active",
    "cancelled",
    "completed",
    "ongoing",
  ];
  citiesArray: any[] = [];





  constructor(private fb: FormBuilder,
    private toaster: ToastrService,
    private venuesService: VenuesService,
    private contentService: ContentService,
    private showService: ShowsService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {

    this.venuesService.getVenuesTest().subscribe({
      next: (res) => {

        this.venuesNameList = res

        //   .filter((venue: any) => {
        //     console.log(venue)
        //     if (venue.address.city.toLowerCase() == selectedCity.toLowerCase() &&
        //       venue.venueFor.toLowerCase() == selectedEventType.toLowerCase()) {
        //       return venue
        //     }
        //   });
      },
      error: (err) => {
        this.toaster.error(err)
      }
    })




    this.setMinDate();


    this.eventForm = this.fb.group({
      eventType: ['', Validators.required],
      imageurl: ['', Validators.required],
      name: ['', Validators.required, Validators.minLength(4)],
      description: ['', [Validators.required, Validators.minLength(30)]],
      runTime: ['', [Validators.required, Validators.min(1)]],
      releasingOn: ['', Validators.required],
      duration: [null, [Validators.required]],
      deleted: [false],
      ageLimit: [13, Validators.required],

      languages: this.fb.array([], Validators.required),

      tag: this.fb.array([], Validators.required),
      categories: this.fb.array([],),
      moreFilters: this.fb.array([],),

      // Nested object arrays
      cast: this.fb.array([this.createCast()]),
      crew: this.fb.array([this.createCrew()]),
    });


    this.showForm = this.fb.group({
      venueName: ['', Validators.required],
      eventType: ['', Validators.required],  // Movie | Sports | Event | Plays | Activities
      city: ['', Validators.required],
      date: ['', Validators.required],
      startTime: ['', [Validators.required, this.validateStartTime()]],

      language: ['', Validators.required],
      status: ['', Validators.required],



      screens: this.fb.array([])
    });

    this.setToday()



  }



 



  getLayouts(screen: AbstractControl): FormArray {
    return screen.get('layouts') as FormArray;
  }


   get screens(): FormArray {
    return this.showForm.get('screens') as FormArray;
  }
  createScreen(screen: any): FormGroup {
    return this.fb.group({
      screenName: [screen.screenName, Validators.required],
      layouts: this.fb.array(
        screen.layouts.map((layout: any) =>
          this.fb.group({
            layoutName: [layout.layoutName, Validators.required],
            rows: [layout.rows, Validators.required],
            cols: [layout.cols, Validators.required],
            price: [0, Validators.required],

            reservedSeats: this.fb.array([])
          })
        )
      ),
      shows: this.fb.array([this.createShow()]),
    });
  }


  onVenueNameChange() {
    const selectedVenueName = this.showForm.get('venueName')?.value;
    // this.handleReset(['eventName']); // reset dependent fields

    this.selectedVenueObj = this.venuesNameList.filter(
      (venue) => venue.venueName === selectedVenueName
    );

    const venue = this.selectedVenueObj[0];

    this.screens.clear();

    venue.screens.forEach((screen: any) => {

      this.screens.push(this.createScreen(screen))

    });


    console.log((this.screens ).value)

  }

  createShow() {
    return this.fb.group({
      date:['',Validators.required],
      startTime: this.fb.array([this.createTime()]),
    })
  }

  getShows(screen: AbstractControl): FormArray {
    return screen.get('shows') as FormArray;
  }


  addShow(screen:AbstractControl){
    this.getShows(screen).push(this.createShow())
  }

  removeShow(screen:AbstractControl,index:number){
    console.log('remove show called')
    this.getShows(screen).removeAt(index)
  }


  getStartTime(show: AbstractControl): FormArray {
    return show.get('startTime') as FormArray
  }

  createTime() {
    return this.fb.control('', [Validators.required])
  }

  addTime(show: AbstractControl) {
    (show.get('startTime') as FormArray).push(this.createTime())
    // this.showForm.get('startTime') as FormArray).push(this.createTime())
  }

  removeTime(show:AbstractControl,index:number){
    this.getStartTime(show).removeAt(index)

  }


  get categories(): FormArray {
    return this.showForm.get('categories') as FormArray;
  }

  getRows(layout: AbstractControl): number {
    return ((layout.get('rows') as FormArray).value).length
  }



  onEventTypeChange() {
    // this.handleReset(['city', 'status', 'venueName', 'eventName'])
    // this.venuesNameList = []
    // this.eventsNameList = []
    // this.languagesArray = []
    // api to get cities
    this.commonService.getAllCities().subscribe(
      (res) => this.citiesArray = res.data)
    let selectedEventType = this.showForm.get('eventType')?.value
    if (selectedEventType != 'Movie') {

      this.showForm.addControl('price', this.fb.control(0, Validators.required));
      this.showForm.removeControl('categories');
      this.showForm.removeControl('format')
      this.showForm.removeControl('screenName')
    }
    else {
      this.showForm.addControl('categories', this.fb.array([]));
      this.showForm.removeControl('reservedSeats');
      this.showForm.removeControl('price')
      this.showForm.addControl('format', this.fb.control('', Validators.required));
      this.showForm.addControl('screenName', this.fb.control('', Validators.required));
    }
  }


  onCityChange() {
    // let selectedEventType = this.showForm.get('eventType')?.value
    // let selectedCity = this.showForm.get('city')?.value

    this.handleReset(['venueName', 'eventName'])
    this.venuesNameList = []
    this.eventsNameList = []
    this.languagesArray = []

  }




  onEventNameChange() {
    let selectedEventName = this.showForm.get('eventName')?.value
    let selectedEventNameObj = this.eventsNameList.find((event: any) => event.name == selectedEventName)
    this.languagesArray = selectedEventNameObj.languages
    this.showForm.get('status')?.setValue('active')
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



  onShowFormSubmit(): void {
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






  // Getters for easy access
  get castControls() {
    return this.eventForm.get('cast') as FormArray;
  }

  get crewControls() {
    return this.eventForm.get('crew') as FormArray;
  }
  getArrayControl(path: string): FormArray {
    return this.eventForm.get(path) as FormArray;
  }

  // Dynamic methods
  addFormArrayItem(path: string, value: any = '') {
    this.getArrayControl(path).push(this.fb.control(value));
  }

  removeFormArrayItem(path: string, index: number) {
    this.getArrayControl(path).removeAt(index);
  }

  createCast(): FormGroup {
    return this.fb.group({
      actorName: ['', Validators.required],
      castImg: ['', Validators.required],
    })
  }

  addCast() {
    this.castControls.push(this.createCast()
    );
  }

  createCrew(): FormGroup {
    return this.fb.group({
      memberName: ['', Validators.required],
      crewImg: ['', Validators.required],
    })
  }

  addCrew() {
    this.crewControls.push(this.createCrew()
    );
  }

  onContentTypeChange() {
    this.selectedEventType = this.eventForm.get('eventType')?.value
    if (this.selectedEventType == 'Movie') {
      this.eventForm.addControl(
        'genres', this.fb.array([], Validators.required));
      this.eventForm.addControl('format', this.fb.array([], Validators.required))//ONLY WHEN EVENT-TYPE =Movie);
    }
    else {
      this.eventForm.removeControl('genres')
      this.eventForm.removeControl('format')
    }


    forkJoin({
      languages: this.contentService.getLanguagesByContentType(this.selectedEventType),
      genres: this.contentService.getGenresByContentType(this.selectedEventType),
      formats: this.contentService.getFormatsByContentType(this.selectedEventType),
      tags: this.contentService.getTagsByContentType(this.selectedEventType),
      categories: this.contentService.getCategoriesByContentType(this.selectedEventType),
      moreFilters: this.contentService.getMoreFiltersByContentType(this.selectedEventType)
    }).subscribe({
      next: (res) => {
        this.languagesArray = res.languages.data;
        this.genresArray = res.genres.data;
        this.formatsArray = res.formats.data;
        this.tagsArray = res.tags.data;
        this.categoriesArray = res.categories.data;
        this.moreFilters = res.moreFilters.data
      },
      error: (err) => {
        this.toaster.error(err.error.message)
      }
    })
  }

  handleInputBoxChange(event: any, path: string) {
    const formArray = this.getArrayControl(path);
    if (event?.target.checked) {
      // Add value if not already present
      if (!formArray.value.includes(Number(event.target.value))) {
        this.addFormArrayItem(path, Number(event.target.value));
      }
    } else {
      const i = formArray.controls.findIndex(
        (ctrl) => ctrl.value === Number(event.target.value)
      );
      if (i !== -1) {
        this.removeFormArrayItem(path, i);
      }
    }
  }

  handleImageUpload(event: Event, path: string, index?: number): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      this.toaster.error('Please upload a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      let base64String = (reader.result as string).split(',')[1];
      if (index == undefined) {
        this.eventForm.get(path)?.setValue(base64String)
      }
      else {
        if (index >= 0 && path == 'cast') {
          (this.castControls.at(index) as FormGroup).get('castImg')?.setValue(base64String)
        }
        else {
          (this.crewControls.at(index) as FormGroup).get('crewImg')?.setValue(base64String)
        }

      }
      this.toaster.success('Image uploaded successfully');
    };
    reader.onerror = () => this.toaster.error('Failed to read file');
    reader.readAsDataURL(file);
  }
  onEventFormSubmit() {
    if (this.eventForm.valid) {
      this.toaster.success('Content Created Successfully')
    }
    else {
      this.eventForm.markAllAsTouched()
      this.toaster.error('All Fields Are Required')
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.eventForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  setMinDate() {
    let minDate = new Date().toISOString().split('T')[0]; // today in yyyy-MM-dd
    return minDate

  }


}
