import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ContentService } from './content-services/content.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, concatMap, forkJoin, from, map, toArray } from 'rxjs';
import { VenuesService } from '../create-venue/venues-services/venues.service';
import { CommonService } from '../../../services/common.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ShowsService } from '../create-show/shows-services/shows.service';
import { AuthService } from '../../../auth/auth-service.service';

type Slot = { start: string; end: string };
@Component({
  selector: 'app-create-content',
  templateUrl: './create-content.component.html',
  standalone: false
})
export class CreateContentComponent implements OnInit, AfterViewInit {

  eventShowForm!: FormGroup;
  tempFormArray!: FormArray
  selectedEventType: string | null = null;
  genresArray: any;
  tagsArray: any;
  categoriesArray: any;
  moreFilters: any;
  contents!: any[]
  minDate = ""
  venues = [];
  selectedVenueObj: any[] = [];
  venuesNameList: any[] = [];
  eventsNameList: any[] = [];
  languagesArray: any[] = [];
  formatsArray: any[] = [];
  screensArray: any[] = [];
  citiesArray: any[] | null = null;
  availableSlotsMap: Map<any, any> = new Map()
  availableSlots: any[] = []


  constructor(private fb: FormBuilder,
    private toaster: ToastrService,
    private venuesService: VenuesService,
    private contentService: ContentService,
    private showService: ShowsService,
    private commonService: CommonService,
    private titleService: Title,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Create Content')
    this.tempFormArray = this.fb.array([])
    this.setToday()
    this.eventShowForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4), this.nameValidator(), Validators.maxLength(50),
      ]],
      description: ['', [Validators.required, Validators.minLength(30), this.descriptionValidator(), Validators.maxLength(250),]],
      runTime: [20, [Validators.required]],
      eventType: ['', [Validators.required]],  // Movie | Sports | Event | Plays | Activities
      imageurl: ['', [Validators.required]],
      ageLimit: [3, [Validators.required]],
      releasingOn: ['', [Validators.required]],
      city: this.fb.array([], [Validators.required]),
      venueName: this.fb.array([], [Validators.required]),

    });
  }

  ngAfterViewInit(): void {
    this.getData()
  }

  ngOnDestroy() {
    this.titleService.setTitle('Book-My-Show');
  }

  /**
  * @description custom validator that validates venueName
  * @author Inzamam
  * @returnType boolean
  */
  nameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (/^\s|\s$/.test(control.value)) {
        return { invalidSpace: true };
      }

      if (!/^[A-Za-z0-9-\s]+$/.test(control.value)) {
        return { invalidCharacter: true };
      }

      if (/^-|-$/.test(control.value)) {
        return { invalidHyphen: true };
      }

      return null;
    };
  }


  /**
    * @description custom validator that validates venueName
    * @author Inzamam
    * @returnType boolean
    */
  descriptionValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (/^\s|\s$/.test(control.value)) {
        return { invalidSpace: true };
      }

      if (!/^[A-Za-z0-9-@,.\s]+$/.test(control.value)) {
        return { invalidCharacter: true };
      }

      if (/^[-@]|[-@]$/.test(control.value)) {
        return { invalidHyphen: true };
      }

      return null;
    };
  }

  /**
  * @description getLayouts of particular screen
  * @author Inzamam
  * @params screen object
  * @return FormArray
  */
  getLayouts(screen: AbstractControl): FormArray {
    return screen.get('layouts') as FormArray;
  }

  getTempArray() {
    return this.tempFormArray as FormArray
  }

  get screens(): FormArray {
    return this.eventShowForm.get('screens') as FormArray;
  }

  /**
  * @description getter function to get screens as FormArray
  * @author Inzamam
  * @return FormArray
  */
  createScreen(screen: any, venueName: string, venueId: string): FormGroup {
    return this.fb.group({
      screenName: [screen.screenName, Validators.required],
      screenId: screen.id,
      venueName,
      venueId,
      layouts: this.fb.array(
        screen.layouts.map((layout: any) =>
          this.fb.group({
            id: [layout.id],
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

  /**
  * @description handler for event type change
  * @author Inzamam
  */
  onEventTypeChange() {
    this.removeControls(this.eventShowForm, ['languages', 'releasingOn', 'genres', 'format', 'tag', 'categories', 'moreFilters', 'screens', 'shows', 'price', 'startDate', 'endDate', 'cast', 'crew']);
    this.eventShowForm.addControl('shows', this.fb.array([this.createShow()], [Validators.required]))
    this.eventShowForm.addControl('price', this.fb.control(0, [Validators.required]))
    this.eventShowForm.addControl('startDate', this.fb.control('', [Validators.required]))
    this.eventShowForm.addControl('endDate', this.fb.control('', [Validators.required]));

    this.eventShowForm.addControl('cast', this.fb.array([this.createCast()]));
    this.eventShowForm.addControl('crew', this.fb.array([this.createCrew()]));


    this.fetchCities()
    this.selectedEventType = this.eventShowForm.get('eventType')?.value
    switch (this.selectedEventType) {
      case 'Movie':
        {
          this.removeControls(this.eventShowForm, ['shows', 'price', 'startDate', 'endDate'])
          this.eventShowForm.addControl('screens', this.fb.array([]))
          this.eventShowForm.addControl('languages', this.fb.array([], [Validators.required]));
          this.eventShowForm.addControl('tag', this.fb.array([], [Validators.required]));
          this.eventShowForm.addControl('genres', this.fb.array([], Validators.required));
          this.eventShowForm.addControl('format', this.fb.array([], Validators.required));
          this.eventShowForm.addControl('releasingOn', this.fb.control('', [Validators.required]));
          break;
        }

      case 'Event': {
        this.eventShowForm.addControl('languages', this.fb.array([], [Validators.required]));
        this.eventShowForm.addControl('categories', this.fb.array([], [Validators.required]));
        this.eventShowForm.addControl('moreFilters', this.fb.array([], [Validators.required]));
        break;
      }

      case 'Plays': {
        this.eventShowForm.addControl('languages', this.fb.array([], [Validators.required]));
        this.eventShowForm.addControl('categories', this.fb.array([], [Validators.required]));
        this.eventShowForm.addControl('genres', this.fb.array([], Validators.required));
        this.eventShowForm.addControl('moreFilters', this.fb.array([], [Validators.required]));
        break;
      }

      case 'Sports': {
        this.removeControls(this.eventShowForm, ['cast', 'crew'])

        this.eventShowForm.addControl('languages', this.fb.array([], [Validators.required]));
        this.eventShowForm.addControl('categories', this.fb.array([], [Validators.required]));
        this.eventShowForm.addControl('moreFilters', this.fb.array([], [Validators.required]));
        break;
      }

      case 'Activities': {
        this.eventShowForm.addControl('languages', this.fb.array([], [Validators.required]));
        this.eventShowForm.addControl('categories', this.fb.array([], [Validators.required]));
        this.eventShowForm.addControl('moreFilters', this.fb.array([], [Validators.required]));
        break;
      }

      default: {
        this.removeControls(this.eventShowForm, ['languages', 'genres', 'format', 'tag', 'categories', 'moreFilters']);
        break;
      }
    }

    forkJoin({
      languages: this.contentService.getLanguagesByContentType(this.selectedEventType),
      genres: this.contentService.getGenresByContentType(this.selectedEventType),
      format: this.contentService.getFormatsByContentType(this.selectedEventType),
      tags: this.contentService.getTagsByContentType(this.selectedEventType),
      categories: this.contentService.getCategoriesByContentType(this.selectedEventType),
      moreFilters: this.contentService.getMoreFiltersByContentType(this.selectedEventType)
    }).subscribe({
      next: (res) => {
        this.languagesArray = res.languages.data;
        this.genresArray = res.genres.data;
        this.formatsArray = res.format.data;
        this.tagsArray = res.tags.data;
        this.categoriesArray = res.categories.data;
        this.moreFilters = res.moreFilters.data
      },
      error: (err) => {
        this.toaster.error(err.error.message)
      }
    })
  }


  /**
  * @description function to fetch all cities array
  * @author Inzamam
  */
  fetchCities() {
    this.commonService.getAllCities().subscribe({
      next: (res) => {
        this.citiesArray = res.data
      },
      error: (err) => {
        this.toaster.error(err.error.message)
      }
    }
    )
  }

  /**
  * @description handler for venue name change
  * @author Inzamam
  */
  onVenueNameChange() {
    const selectedVenueName = (this.eventShowForm.get('venueName') as FormArray)?.value;
    this.selectedVenueObj = this.venuesNameList.filter(v =>
      selectedVenueName.includes(v.venueName)
    );
    const selectedVenues: any[] = this.selectedVenueObj;
    if (this.eventShowForm.get('eventType')?.value == 'Movie') {
      this.screens?.clear();
      selectedVenues.forEach((venue: any) => {
        venue?.screens?.forEach((screen: any) => {
          this.screens.push(this.createScreen(screen, venue.venueName, venue.id))
        })
      });
    }
  }

  /**
  * @description function that creates form group of show
  * @author Inzamam
  * @return FormGroup
  */
  createShow() { //for movies
    return this.fb.group({
      date: ['', Validators.required],
      startTime: this.fb.array([], Validators.required),
    })
  }

  /**
  * @description function to get shows from screen
  * @author Inzamam
  * @params Screen obj
  * @return FormArray
  */
  // for movies
  getShows(screen: AbstractControl): FormArray {
    return screen.get('shows') as FormArray;
  }

  /**
  * @description function to add show to screen 
  * @author Inzamam
  * @params Screen obj
  */
  // for movies
  addShow(screen: AbstractControl) {
    this.getShows(screen).push(this.createShow())
  }

  /**
  * @description function to remove show from screen 
  * @author Inzamam
  * @params Screen obj
  */
  // for movies
  removeShow(screen: AbstractControl | FormGroup, index: number) {
    const shows = this.getShows(screen);
    if (!shows || shows.length <= 1) return;

    shows.removeAt(index);
    const newShowsArray = this.fb.array(shows.controls);
    (screen as FormGroup).setControl('shows', newShowsArray);
  }

  /**
  * @description get start time  of show
  * @author Inzamam
  * @param screen object
  * @return FormArray
  */
  getStartTime(show: AbstractControl): FormArray { //shows
    return show.get('startTime') as FormArray
  }


  /**
  * @description function to create showTime control
  * @author Inzamam
  */
  createShowTime() { //shows

    return this.fb.control('', [Validators.required])
  }

  /**
  * @description function to add showTime 
  * @author Inzamam
  * @params Show obj
  */
  addShowTime(show: AbstractControl) { //shows
    this.getStartTime(show).push(this.createShowTime())
  }

  /**
* @description function that add or removes show time based on checked or unchecked
* @author Inzamam
* @params payload:event
*/
  toggleShowTime(event: any, show: AbstractControl) {
    let slot = JSON.parse(event.target.value);
    if (event.target.checked) {
      this.getStartTime(show).push(this.fb.control(slot.start));
    } else {
      let index = this.getStartTime(show).controls.findIndex((ctrl) => ctrl.value === slot.start)
      if (index != -1) this.getStartTime(show).removeAt(index);
    }


    if (this.getStartTime(show).controls.length == 0) {
      this.getStartTime(show).setErrors({ required: true });
    }
    this.getStartTime(show)?.markAsTouched()
    this.getStartTime(show)?.updateValueAndValidity();
  }

  /**
  * @description function to remove showTime 
  * @author Inzamam
  * @params Show obj
  */
  removeShowTime(show: AbstractControl, index: number) { //shows
    if (this.getStartTime(show).length <= 1) return;
    this.getStartTime(show).removeAt(index)
  }

  get categories(): FormArray {
    return this.eventShowForm.get('categories') as FormArray;
  }

  getRows(layout: AbstractControl): number {
    return ((layout.get('rows') as FormArray).value).length
  }

  get shows(): FormArray {//
    return this.eventShowForm.get('shows') as FormArray
  }
  addEventShow() {
    this.shows.push(this.createShow())
  }

  removeEventShow(index: number) {
    const shows = this.shows;
    if (!shows || shows.length <= 1) return;

    shows.removeAt(index);
    const newShowsArray = this.fb.array(shows.controls);
    this.eventShowForm.setControl('shows', newShowsArray);
  }

  removeControls(form: FormGroup, controls: string[]) {
    controls.forEach(control => {
      if (form.contains(control)) {
        form.removeControl(control);
      }
    });
  }

  setToday() {
    let today = new Date();
    today.setDate(today.getDate() + 1);
    this.minDate = today.toISOString().split('T')[0];
    return this.minDate
  }
  durationOrReleasingOnChange() {
    if (this.eventShowForm.get('eventType')?.value && this.eventShowForm.get('eventType')?.value == 'Movie') {
      this.screens.controls.forEach((screen: any) => {
        (screen.get('shows') as FormArray)
          .controls.forEach(show => {
            show.get('date')?.setValue('')
          })
      })
    }

    // non movie case
    if (this.eventShowForm.get('eventType')?.value && this.eventShowForm.get('eventType')?.value != 'Movie') {
      this.shows.controls.forEach(show => {
        show.get('date')?.setValue('')
      })
    }

    this.availableSlotsMap.clear()
  }
  onStartOnChange() {
    this.eventShowForm.get('endDate')?.setValue('');
    this.shows.controls.forEach(show => {
      show.get('date')?.setValue('')
    })
  }

  onEndOnChange() {
    this.shows.controls.forEach(show => {
      show.get('date')?.setValue('')
    })
  }

  setMinEndDate() {
    const startDateValue = this.eventShowForm.get('startDate')?.value;
    if (startDateValue) {
      const startDate = new Date(startDateValue);

      return startDate.toISOString().split('T')[0];
    }
    return null;
  }


  /**
  * @description function to set minDate for show start date
  * @params number
  * @author Inzamam
  * @return string
  */

  validateShowStartDate(index: number): string {
    if (this.eventShowForm.get('releasingOn')?.value || this.eventShowForm.get('startDate')?.value) {
      const today = new Date(this.eventShowForm.get('releasingOn')?.value || this.eventShowForm.get('startDate')?.value)
      const minDate = new Date(today);
      minDate?.setDate(today.getDate() + index);
      return minDate?.toISOString()?.split('T')[0]
    }
    return ''
  }

  /**
  * @description function to set minDate for show end date
  * @params number
  * @author Inzamam
  * @return string
  */
  validateShowEndDate(): string {
    if (this.eventShowForm.get('releasingOn')?.value || this.eventShowForm.get('endDate')?.value) {
      const today = new Date(this.eventShowForm.get('releasingOn')?.value || this.eventShowForm.get('endDate')?.value)
      const minDate = new Date(today);
      minDate?.setDate(today.getDate());
      return minDate?.toISOString()?.split('T')[0]
    }
    return ''
  }


  timeToMinutes(hhmm: string): number {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  }
  minutesToTime(min: number): string {
    const h = Math.floor(min / 60).toString().padStart(2, '0');
    const m = (min % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  }



  // generateSlots inside a free window
  generateSlots(freeStart: string, freeEnd: string, slotDurationMin: number, gapMin = 0): Slot[] {
    const startM = this.timeToMinutes(freeStart);
    const endM = this.timeToMinutes(freeEnd);
    const out: Slot[] = [];
    let cur = startM;

    while (cur + slotDurationMin <= endM) {
      const s = cur;
      const e = cur + slotDurationMin;
      out.push({ start: this.minutesToTime(s), end: this.minutesToTime(e) });
      cur = e + gapMin;
    }

    return out;
  }

  generateAllAvailableSlots(freeWindows: { startTime: string; endTime: string }[], slotDurationMin: number, gapMin = 0, venueId: any, selectedDate: any, screenId?: any) {
    let res = freeWindows.flatMap(window =>
      this.generateSlots(window.startTime, window.endTime, slotDurationMin, gapMin)
    );
    let sId = screenId ?? ''
    if (this.availableSlotsMap.has(`${venueId}${sId}${selectedDate}`)) {
      this.availableSlotsMap.delete(`${venueId}${sId}${selectedDate}`);
      this.availableSlotsMap.set(`${venueId}${sId}${selectedDate}`, res);
    }
    this.availableSlotsMap.set(`${venueId}${sId}${selectedDate}`, res);
    this.availableSlots = Array.from(this.availableSlotsMap, ([key, value]) => ({ key, value }));

  }

  fetchFreeTimeSlots(show: AbstractControl, venueId: string, event: Event, screenId?: string) {
    this.getStartTime(show).clear()
    let selectedDate = event.target as HTMLInputElement;
    this.contentService.getAvailableTimeSlots(venueId, selectedDate.value, screenId).subscribe({
      next: (res) => {
        if (res.statusCode == 200) {
          this.toaster.success(res.message)
          this.generateAllAvailableSlots(res.data, this.eventShowForm.get('runTime')?.value, 30, venueId, selectedDate.value, screenId);
        }
      },
      error: (err) => {
        this.generateAllAvailableSlots([{ startTime: '12:00', endTime: '15:00' }, { startTime: '18:00', endTime: '23:00' }], this.eventShowForm.get('runTime')?.value, 30, venueId, selectedDate.value, screenId)
        this.toaster.error(err.error.message.split(':')[1])

      }
    })


  }
  /**
  * @description function to submit the form 
  * @author Inzamam
  */
  onShowFormSubmit(): void {

    const formValue = this.eventShowForm.getRawValue();

    const selectedVenueIds = this.selectedVenueObj
      ?.filter((venue: any) => formValue.venueName?.includes(venue.venueName))
      .map((venue: any) => venue.id);
    let shows: any[] = [];
    if (formValue?.eventType === 'Movie') {
      shows = formValue?.screens?.flatMap((screen: any) => ({
        venue: screen.venueId ?? screen.venueName,
        screen: screen.screenId ?? screen.screenName,
        category: screen.layouts.map((layout: any) => ({ layout: layout.id ?? layout.layoutName, moviePrice: Number(layout.price || 0), })),
        showtimesdate: screen.shows?.map((show: any) => ({
          showDate: show.date,
          showTime: Array.isArray(show.startTime)
            ? show.startTime
            : [show.startTime],
        })) ?? [],
      }))
    }

    else {
      shows = selectedVenueIds.map((venueId: number) => ({
        venue: venueId,
        screen: null,
        category: null,
        showPrice: Number(formValue.price || 0),
        showtimesdate: formValue.shows?.map((show: any) => ({
          showDate: show.date,
          showTime: Array.isArray(show.startTime)
            ? show.startTime
            : [show.startTime],
        })) ?? [],
      }));
    }

    const selectedCityIds = this.citiesArray
      ?.filter((city: any) => this.city.value.includes(city.cityName))
      .map((city: any) => city.cityId);
    const toNumericArray = (arr: any[]) =>
      arr?.map((item: any) => (typeof item === 'object' ? item.id || item.value : Number(item))) || [];

    let adminId = this.authService.userDetailsSignal().userId
    const payload = {
      adminId: adminId,
      name: formValue?.name,
      description: formValue?.description,
      runTime: formValue?.runTime,
      startDate: formValue?.startDate,
      endDate: formValue?.endDate,
      eventType: formValue?.eventType,
      imdbRating: Number(formValue?.imdbRating),
      likes: Number(formValue?.likes),
      votes: Number(formValue?.votes),
      currentlyPlaying: Boolean(formValue?.eventType == 'Movie' ? (new Date(formValue?.releasingOn) <= new Date()) : (new Date(formValue?.startDate) <= new Date())),
      ageLimit: Number(formValue?.ageLimit),
      releasingOn: formValue?.releasingOn,
      languages: toNumericArray(formValue?.languages),
      genres: toNumericArray(formValue?.genres),
      format: toNumericArray(formValue?.format),
      tag: toNumericArray(formValue?.tag),
      releaseMonth: toNumericArray(formValue?.releaseMonth),
      dateFilter: toNumericArray(formValue?.dateFilter),
      categories: toNumericArray(formValue?.categories),
      moreFilters: toNumericArray(formValue?.moreFilters),
      cast: formValue?.cast?.map((member: any) => ({
        actorName: member.actorName,
        castImg: member.castImg
      })),
      crew: formValue?.crew?.map((member: any) => ({
        memberName: member.memberName,
        crewImg: member.crewImg
      })),
      city: selectedCityIds,
      show: shows
    };

    //Validate & Submit
    if (this.eventShowForm.valid) {
      this.showService.createShow(payload, formValue.imageurl, payload.cast, payload.crew).subscribe({
        next: () => {
          this.toaster.success('Show created successfully');
          this.router.navigate(['/admin/list/content'])
        },
        error: (err) => this.toaster.error(err.error.message)
      });
    } else {
      this.toaster.error('Form Invalid — Please check all fields');
      this.eventShowForm.markAllAsTouched();
    }
  }
  /**
  * @description utility funct. to reset form controls takes array of form-control names to reset 
  * @author Inzamam
  * @params formcontrols[]
  */
  handleReset(formControls: any[]) {
    formControls.forEach((ctrl) => {
      this.eventShowForm.get(ctrl)?.reset();
      this.eventShowForm.get(ctrl)?.setValue([])
    })
  }

  /**
  * @description getter func. to access form controls of cast
  * @author Inzamam
  * @returns FormArray
  */
  get castControls() {
    return this.eventShowForm.get('cast') as FormArray;
  }

  /**
* @description getter func. to access form controls of crew
* @author Inzamam
* @returns FormArray
*/
  get crewControls() {
    return this.eventShowForm.get('crew') as FormArray;
  }

  /**
* @description genric getter func. to access form controls 
* @author Inzamam
* @returns FormArray
*/
  getArrayControl(path: string): FormArray {
    return this.eventShowForm.get(path) as FormArray;
  }

  // Dynamic methods
  addFormArrayItem(path: string, value: any = '') {
    this.getArrayControl(path).push(this.fb.control(value));
  }

  removeFormArrayItem(path: string, index: number) {
    this.getArrayControl(path).removeAt(index);
  }

  /**
* @description func. that creates form group for cast
* @author Inzamam
* @returns FormGroup
*/
  createCast(): FormGroup {
    return this.fb.group({
      id: [crypto.randomUUID()],
      actorName: ['', Validators.required],
      castImg: [''],
    })
  }

  /**
* @description function to add a FormGroup into cast array
* @author Inzamam
* @returns FormGroup
*/
  addCast() {
    this.castControls.push(this.createCast()
    );
  }

  /**
* @description func. that creates form group for crew
* @author Inzamam
* @returns FormGroup
*/
  createCrew(): FormGroup {
    return this.fb.group({
      id: [crypto.randomUUID()],
      memberName: ['', Validators.required],
      crewImg: [''],
    })
  }
  /**
* @description function to add a FormGroup into cast array
* @author Inzamam
* @returns FormGroup
*/
  addCrew() {
    this.crewControls.push(this.createCrew()
    );
  }

  /**
  * @description function that add or removes event item based on checked or unchecked
  * @author Inzamam
  * @params payload:event,path
  */
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

  get city(): FormArray {
    return this.eventShowForm.get('city') as FormArray
  }
  /**
  * @description function that add or removes city based on checked or unchecked
  * @author Inzamam
  * @params payload:event
  */
  toggleCity(event: any) {
    let isExisting = this.eventShowForm.get('city')?.value.includes(event.value)
    if (!isExisting) {
      this.city.push(this.fb.control(event.value));
    } else {
      let index = this.city.controls.findIndex((ctrl) => ctrl.value === event.value)
      if (index != -1) this.city.removeAt(index);

    }
    this.eventShowForm.get('city')?.markAsTouched()
    this.eventShowForm.get('city')?.updateValueAndValidity();
    this.venueName.clear();
    if (this.eventShowForm.get('eventType')?.value != 'Movie') (this.eventShowForm.get('shows') as FormArray).clear();


    this.venuesNameList = []
    this.selectedVenueObj = []
    this.callApiForCities();
  }

  /**
  * @description function that fetches venues list based on selected city and sets it to venuesNameList
  * @author Inzamam
  */
  callApiForCities() {
    const cities: string[] = this.city.value;
    from(cities)
      .pipe(
        concatMap((city: string) =>
          this.venuesService.getVenues(city).pipe(
            map((res: any) => ({
              city,
              venues: res.data.filter(
                (venue: any) =>
                  venue.venueType === this.eventShowForm.get('eventType')?.value
              ),
            })),
            catchError((err) => {
              this.toaster.error(`Error fetching venues for ${city}`, err.error.message);
              return [];
            })
          )
        ),
        toArray()
      )
      .subscribe({
        next: (results) => {
          this.venuesNameList = results.flatMap((r) => r.venues);
        },
        error: (err) => this.toaster.error(err.error.message)
      });
  }

  get venueName(): FormArray {
    return this.eventShowForm.get('venueName') as FormArray
  }

  toggleVenueName(event: any) {
    if (this.eventShowForm.get('eventType')?.value != 'Movie') {
      this.venueName.clear();
      (this.eventShowForm.get('shows') as FormArray).clear()
      this.addEventShow()
    }

    let isExisting = this.venueName?.value.includes(event.value)

    if (!isExisting) {
      this.venueName.push(this.fb.control(event.value));
    }
    else {
      let index = this.venueName.controls.findIndex((ctrl) => ctrl.value === event.value)
      if (index != -1) this.venueName.removeAt(index);
    }
    this.eventShowForm.get('venueName')?.markAsTouched()
    this.eventShowForm.get('venueName')?.updateValueAndValidity();

    this.onVenueNameChange()
  }

  setEventType(value: any) {
    this.eventShowForm.get('eventType')?.setValue(value)
    this.city.clear()
    this.venueName.clear()
    this.venuesNameList = []
    this.selectedVenueObj = []
    this.onEventTypeChange()
  }

  /**
  * @description function that handles image upload for cast and crew in base64 url
  * @author Inzamam
  * @params payload:event,path,index
  */
  handleImageUpload(event: Event, path: string, index: number): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const maxSizeBytes = 400 * 1024
    if (file.size > maxSizeBytes) {
      this.toaster.error(`File size exceeds ${400} KB limit`);
      input.value = '';
      if (index >= 0 && path == 'cast') {
        (this.castControls.at(index) as FormGroup).get('castImg')?.setValue('')
      }
      else {
        (this.crewControls.at(index) as FormGroup).get('crewImg')?.setValue('')
      }
      return;
    }
    if (file.type.startsWith('image/jpeg') || file.type.startsWith('image/png')) {
      const reader = new FileReader();
      reader.onload = () => {
        let base64String = (reader.result as string).split(',')[1];
        if (index == undefined) {
          this.eventShowForm.get(path)?.setValue(base64String)
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
    else {
      this.toaster.error('Please upload a valid image file');
      input.value = '';
      if (index >= 0 && path == 'cast') {
        (this.castControls.at(index) as FormGroup).get('castImg')?.setValue('')
      }
      else {
        (this.crewControls.at(index) as FormGroup).get('crewImg')?.setValue('')
      }
      this.eventShowForm.get(path)?.setValue('')
      return;
    }
  }


  /**
  * @description function that handles image upload for event poster image in BLOB form
  * @author Inzamam
  * @params payload:event,path
  */
  handlePosterImgUpload(event: Event, path: string) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    let file: File | null = input.files[0];
    const maxSizeBytes = 400 * 1024
    if (file.size > maxSizeBytes) {
      this.toaster.error(`File size exceeds ${400} KB limit`);
      input.value = '';
      this.eventShowForm.get(path)?.setValue('')
      return;
    }
    if (file.type.startsWith('image/jpeg') || file.type.startsWith('image/png')) {
      this.eventShowForm.get(path)?.setValue(file)
      this.toaster.success('Image uploaded successfully');
    }
    else {
      this.toaster.error('Please upload a valid image file');
      input.value = '';
      this.eventShowForm.get(path)?.setValue('')
      return;
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.eventShowForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  eventType: any | null = null;
  getData() {
    this.eventType = history.state.contentTypeName;
    if (this.eventType) {
      this.eventShowForm.get('eventType')?.setValue(this.eventType);
      this.onEventTypeChange()
      this.fetchCities()
    }
  }

  removeCastControl(castControls: FormArray, index: number) {
    if (castControls.length == 1) return;
    else {
      castControls.at(index).get('castImg')?.setValue('')
      castControls.removeAt(index)
    }

    this.eventShowForm.setControl('cast', new FormArray([...castControls.controls]));
  }

  removeCrewControl(crewControls: FormArray, index: number) {
    if (crewControls.length == 1) return;
    else {
      crewControls.removeAt(index)
    }
    this.eventShowForm.setControl('crew', new FormArray([...crewControls.controls]));
  }
}