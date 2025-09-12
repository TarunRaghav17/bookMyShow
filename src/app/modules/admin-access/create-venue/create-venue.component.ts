import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-venue-form',
    templateUrl: './create-venue.component.html'
})
export class CreateVenueComponent implements OnInit {
  venueForm!: FormGroup;
  tempAmmenity = new FormControl('', [Validators.required])
  venueFor: any[] = []
  venueType: any[] = [];

  supportedCategoriesArray: any[] = []

  alphabets = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
  ]

  venueTypeMapping = {
    "movies": [
      { "value": "theatre", "label": "Theater" }
    ],
    "sports": [
      { "value": "stadium", "label": "Stadium" },
      { "value": "ground", "label": "Ground" },
      { "value": "court", "label": "Court" },
    ],
    "events": [
      { "value": "auditorium", "label": "Auditorium" },
      { "value": "banquet_hall", "label": "Banquet Hall" },
      { "value": "open_air", "label": "Open Air Venue" },
      { "value": "exhibition_hall", "label": "Exhibition Hall" }
    ],
    "activities": [
      { "value": "studio", "label": "Studio" },
      { "value": "classroom", "label": "Classroom" },
      { "value": "workshop_hall", "label": "Workshop Hall" }
    ]
  }

  supportedCategoriesMapping = {
    "movies": {
      "theatre": [
        {
          "value": "imax", "label": "imax"
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
      ]
    },

    "sports": {
      "ground": [
        { "value": "cricket", "label": "Cricket" },
        { "value": "football", "label": "Football" },
        { "value": "hockey", "label": "Hockey" },
      ],
      "stadium": [
        { "value": "cricket", "label": "Cricket" },
        { "value": "football", "label": "Football" },
        { "value": "rugby", "label": "Rugby" },

      ],
      "court": [
        { "value": "tennis", "label": "Tennis" },
        { "value": "badminton", "label": "Badminton" },
        { "value": "basketball", "label": "Basketball" }
      ],
    },
    "events": {
      "auditorium": [
        { "value": "concert", "label": "Concert" },
        { "value": "theatre", "label": "Theatre Play" },
        { "value": "dance", "label": "Dance Show" }
      ],

      "banquet_hall": [
        { "value": "wedding", "label": "Wedding" },
        { "value": "reception", "label": "Reception" },
        { "value": "party", "label": "Private Party" }
      ],
      "open_air": [
        { "value": "festival", "label": "Festival" },
        { "value": "music_show", "label": "Music Show" },
        { "value": "fair", "label": "Fair / Carnival" }
      ],
      "exhibition_hall": [
        { "value": "art_show", "label": "Art Exhibition" },
        { "value": "tech_expo", "label": "Tech Expo" },
        { "value": "book_fair", "label": "Book Fair" }
      ]
    },
    "activities": {
      "studio": [
        { "value": "yoga", "label": "Yoga" },
        { "value": "dance", "label": "Dance Class" },
        { "value": "aerobics", "label": "Aerobics" }
      ],
      "classroom": [
        { "value": "coding", "label": "Coding Bootcamp" },
        { "value": "art", "label": "Art Class" },
        { "value": "music", "label": "Music Class" }
      ],

      "workshop_hall": [
        { "value": "craft", "label": "Craft Workshop" },
        { "value": "photography", "label": "Photography Workshop" },
        { "value": "cooking", "label": "Cooking Workshop" }
      ]
    }

  }

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.venueForm = this.fb.group({
      venueName: ['', Validators.required],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        pin: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
      }),
      venueCapacity: ['', [Validators.required, Validators.min(1)]],
      venueFor: ['', Validators.required],
      venueType: ['', Validators.required],
      supportedCategories: ['', Validators.required],
      additionalFields: this.fb.group({}),
      amenities: this.fb.array([])
    });

  }


  onVenueForChange() {
    let venueFor = this.venueForm.get('venueFor')?.value as keyof typeof this.venueTypeMapping
    this.venueForm.get('venueType')?.setValue('')
    this.venueForm.get('supportedCategories')?.setValue('')
    let additionalFields = this.venueForm.get('additionalFields') as FormGroup
    this.venueType = this.venueTypeMapping[venueFor]

    if (venueFor == 'movies') {
      additionalFields.addControl('screens',
        this.fb.array([this.createScreen()]))
    }
    else {
      additionalFields.removeControl('screens')
    }
  }

  onVenueTypeChange() {
    this.venueForm.get('supportedCategories')?.setValue('')
    let venueForValue = this.venueForm.get('venueFor')?.value as keyof typeof this.supportedCategoriesMapping
    let venueTypeValue = this.venueForm.get('venueType')?.value as keyof typeof this.supportedCategoriesMapping[typeof venueForValue]
    this.supportedCategoriesArray = this.supportedCategoriesMapping[venueForValue][venueTypeValue]
  }

  get screens() {
    return this.venueForm.get('additionalFields.screens') as FormArray
  }

  createScreen() {
    return this.fb.group({
      screenName: [''],
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
      layoutName: [''],
      rows: this.fb.array([], Validators.required),
      cols: ['12', Validators.required]
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
    if (this.venueForm.valid) {
      // --------to do-----------------
      // bind the api from backend
    } else {
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

