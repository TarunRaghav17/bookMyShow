import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { VenuesService } from './venues-services/venues.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../services/common.service';

@Component({
  standalone: false,
  selector: 'app-venue-form',
  templateUrl: './create-venue.component.html'
})
export class CreateVenueComponent implements OnInit {

  venueForm!: FormGroup;
  tempAmmenity = new FormControl('', [Validators.required])
  venueType: any[] = [];
  citiesArray: any[] = []
  supportedCategoriesArray: any[] | null = null
  slotDuration: any = 60

  alphabets = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
  ]
  supportedCategoriesMapping = {
    "Movie":
      [
        {
          "value": "imax", "label": "IMAX"
        },
        {
          "value": "3d", "label": "3D"
        },
        {
          "value": "2d", "label": "2D"
        },
        {
          "value": "4d", "label": "4D"
        }
      ],
    "Sports":
      [
        { "value": "cricket", "label": "Cricket" },
        { "value": "football", "label": "Football" },
        { "value": "hockey", "label": "Hockey" },
        { "value": "tennis", "label": "Tennis" },
        { "value": "badminton", "label": "Badminton" },
        { "value": "basketball", "label": "Basketball" }
      ],
    "Event":
      [
        { "value": "concert", "label": "Concert" },
        { "value": "theatre", "label": "Theatre Play" },
        { "value": "dance", "label": "Dance Show" },
        { "value": "wedding", "label": "Wedding" },
        { "value": "reception", "label": "Reception" },
      ],
    "Activities":
      [
        { "value": "yoga", "label": "Yoga" },
        { "value": "dance", "label": "Dance Class" },
        { "value": "coding", "label": "Coding Bootcamp" },
        { "value": "music", "label": "Music Class" },
        { "value": "photography", "label": "Photography Workshop" },
        { "value": "cooking", "label": "Cooking Workshop" }
      ],

    "Plays":
      [
        { "value": "tragedy", "label": "Tragedy" },
        { "value": "comedy", "label": "Comedy" },
        { "value": "musical", "label": "Musical" },
        { "value": "comedy", "label": "Comedy" },
        { "value": "musical", "label": "Musical" },
        { "value": "experimental", "label": "Experimental" },
        { "value": "interactive", "label": "Interactive" },
        { "value": "musical", "label": "Musical" },
        { "value": "classical_play", "label": "Classical Play" },
        { "value": "school_play", "label": "School Play" },
      ]
  }

  constructor(private fb: FormBuilder,
    private venuesService: VenuesService,
    private toaster: ToastrService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.venueForm = this.fb.group({
      venueName: ['', Validators.required],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        pin: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
      }),
      venueCapacity: ['', [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+$/)]],
      venueType: ['', Validators.required],
      supportedCategories: this.fb.array([], [Validators.required]),
      amenities: this.fb.array([]),
      timeSlots: this.fb.array([this.createTimeSlots(), this.createTimeSlots(), this.createTimeSlots()])
    });

    this.fetchCities()
  }
  fetchCities() {
    this.commonService.getAllCities().subscribe({
      next: (res) => {
        this.citiesArray = res.data
      },
      error: (err) => {
        this.toaster.error(err.error.message)
      }
    })
  }
  onVenueTypeChange() {
    let venueType = this.venueForm.get('venueType')?.value as keyof typeof this.supportedCategoriesMapping
    this.categories.clear()
    this.supportedCategoriesArray = this.supportedCategoriesMapping[venueType]
    if (venueType == 'Movie') {
      this.venueForm.addControl('screens',
        this.fb.array([this.createScreen()]))
    }
    else {
      this.venueForm.removeControl('screens')
    }
  }

  get categories() {
    return this.venueForm.get('supportedCategories') as FormArray
  }

  createTimeSlots() {
    return this.fb.group({
      startTime: ['', [Validators.required]],
      endTime: [{ value: '', disabled: true }, [Validators.required]]
    })
  }
  get timeSlots() {
    return this.venueForm.get('timeSlots') as FormArray
  }
  addTimeSlot() {
    if (this.timeSlots.length < 10) {
      this.timeSlots.push(this.createTimeSlots())
    }
    return
  }
  removeTimeSlot(index: number) {
    this.timeSlots.removeAt(index);
  }

  onSlotDurationChange(event: any) {
    this.slotDuration = Number(event.target.value)
    console.log(this.slotDuration)
  }

  onSlotStartTimeChange(slot: AbstractControl, slotIndex: number) {
    let startTime = slot.get('startTime')?.value;

    // enforce startTime >= prev endTime
    let prevEnd = this.getPrevEndTime(slotIndex);
    console.log(prevEnd)
    if (startTime < prevEnd) {
      slot.get('startTime')?.setValue(this.addMinutes(prevEnd, 30));
      startTime = prevEnd;
    }
    let endTime = this.addMinutes(startTime, this.slotDuration);
    slot.get('endTime')?.setValue(endTime);
  }

  getPrevEndTime(slotIndex: number): string {
    if (slotIndex === 0) return "00:00";
    const prevSlot = this.timeSlots.at(slotIndex - 1)?.getRawValue();
    return prevSlot?.endTime || "00:00";
  }

  addMinutes(start: string, minutes: number): string {
    const [h, m] = start.split(':').map(Number);
    const date = new Date(0, 0, 0, h, m);
    date.setMinutes(date.getMinutes() + minutes);
    return date.toTimeString().substring(0, 5); // "HH:mm"
  }
  handleCategoryChange(event: any) {
    if (event.target.checked) {
      this.categories.push(this.fb.control(event.target.value));
    } else {
      let index = this.categories.controls.findIndex((ctrl) => ctrl.value === event.target.value)
      if (index != -1) this.categories.removeAt(index);
    }
  }

  get screens() {
    return this.venueForm.get('screens') as FormArray
  }

  createScreen() {
    return this.fb.group({
      screenName: ['', Validators.required],
      layouts: this.fb.array([this.createLayout()])
    })
  }

  addScreen() {
    this.screens.push(this.createScreen())
  }

  removeScreen(index: number) {
    this.screens.removeAt(index)
  }

  getLayouts(screen: AbstractControl): FormArray {
    return screen.get('layouts') as FormArray
  }

  getUsedRowsInScreen(screen: AbstractControl): string[] {
    let used: string[] = [];
    let layouts = this.getLayouts(screen).controls;
    layouts.forEach(layout => {
      let rows = layout.get('rows') as FormArray;
      rows.controls.forEach(ctrl => {
        if (ctrl.value) {
          used.push(ctrl.value);
        }
      });
    });
    return used;
  }

  getAvailableRows(screen: AbstractControl, currentLayout: AbstractControl): string[] {
    let used = this.getUsedRowsInScreen(screen);
    let currentRows = (currentLayout.get('rows') as FormArray).value;
    return this.alphabets.filter(letter => !used.includes(letter) || currentRows.includes(letter));
  }

  createLayout() {
    return this.fb.group({
      layoutName: ['', Validators.required],
      rows: this.fb.array([], Validators.required),
      cols: ['12', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
    })
  }

  addLayout(screen: AbstractControl) {
    this.getLayouts(screen).push(this.createLayout())
  }
  removeLayout(screen: AbstractControl, $index: number) {
    this.getLayouts(screen).removeAt($index)
  }
  // Getter for amenities
  get amenities(): FormArray {
    return this.venueForm.get('amenities') as FormArray;
  }
  // Add/Remove amenities
  addAmenity(): void {
    if (this.tempAmmenity.valid) {
      this.amenities.push(this.fb.control(this.tempAmmenity.value));
      this.tempAmmenity.reset()
    }
  }
  removeAmenity(index: number): void {
    this.amenities.removeAt(index);
  }

  // Submit
  onSubmit(): void {
    console.log(this.venueForm.value)
    if (this.venueForm.valid) {
      this.venuesService.createVenueService(this.venueForm.value).subscribe({
        next: () => {
          this.toaster.success('Venue created successfully')
          this.venueForm.removeControl('screens')
          this.venueForm.reset()
          this.venueForm.get('venueFor')?.setValue('')
          this.venueForm.get('venueType')?.setValue('')
          this.venueForm.get('supportedCategories')?.setValue('')
        },
        error: (err) => {
          this.toaster.error(err.message)
        }
      })
    } else {
      this.toaster.error('All fields are required')
      this.venueForm.markAllAsTouched();
    }
  }

  onCheckboxChange(event: any, layout: AbstractControl) {
    let rows = layout.get('rows') as FormArray
    if (event.target.checked) {
      rows.push(new FormControl(event.target.value))
    }
    else {
      const index = rows.controls.findIndex(x => x.value === event.target.value);
      rows.removeAt(index)
    }
  }


}

