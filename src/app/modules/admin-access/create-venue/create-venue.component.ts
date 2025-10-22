import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { VenuesService } from './venues-services/venues.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../services/common.service';
import { Title } from '@angular/platform-browser';
@Component({
  standalone: false,
  selector: 'app-venue-form',
  templateUrl: './create-venue.component.html'
})
export class CreateVenueComponent implements OnInit {

  venueForm!: FormGroup;
  tempAmmenity = new FormControl('', [])
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
    private commonService: CommonService,
    private titleService: Title,

  ) { }

  /**
  * @description lifecycle hook that initializes the form (venueForm) & calls fetchCities .
  * @author Inzamam
  * @returnType void
  */
  ngOnInit(): void {

    this.titleService.setTitle('Create Venue')

    this.venueForm = this.fb.group({
      venueName: ['', [Validators.required, this.nameValidator()
      ]],
      address: this.fb.group({
        street: ['', [Validators.required, this.streetNameValidator()]],
        cityName: ['', Validators.required],
        pin: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
      }),
      venueCapacity: ['', [Validators.required, Validators.min(5), Validators.pattern(/^[0-9]+$/)]],
      venueType: ['', Validators.required],
      supportedCategories: this.fb.array([], Validators.required),
      amenities: this.fb.array([], [this.nameValidator()]),

    });

    this.fetchCities()
  }




  /**
  * @description custom validator that validates venueName
  * @author Inzamam
  * @returnType boolean
  */
  nameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value != '') {
        if (/^\s|\s$/.test(control.value)) {
          return { invalidSpace: true };
        }

        if (!/^[A-Za-z0-9-\s]+$/.test(control.value)) {
          return { invalidCharacter: true };
        }

        if (/^-|-$/.test(control.value)) {
          return { invalidHyphen: true };
        }

      }

      return null;
    };
  }
  /**
   * @description custom validator that validates street name
   * @author Inzamam
   * @returnType boolean
   */
  streetNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (/^\s|\s$/.test(control.value)) {
        return { invalidSpace: true };
      }

      if (!/^[A-Za-z0-9-,\s]+$/.test(control.value)) {
        return { invalidCharacter: true };
      }

      if (/^[-,]|[-,]$/.test(control.value)) {
        return { invalidSymbol: true };
      }

      return null;
    };
  }



  /**
  * @description function that fetches cities
  * @author Inzamam
  * @returnType void
  */
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

  /**
  * @description function that handles venue type change and adds/remove form control (screens)
  * @author Inzamam
  * @returnType void
  */
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


  /**
  * @description getter function to get categories as FormArray.
  * @author Inzamam
  * @returnType FormArray
  */
  get categories() {
    return this.venueForm.get('supportedCategories') as FormArray
  }


  /**
  * @description function that handles supported category change .
  * @author Inzamam
  * * @params event where change occurs
  * @returnType void
  */
  handleCategoryChange(event: any) {
    if (event.target.checked) {
      this.categories.push(this.fb.control(event.target.value));
    } else {
      let index = this.categories.controls.findIndex((ctrl) => ctrl.value === event.target.value)
      if (index != -1) this.categories.removeAt(index);
    }
    this.venueForm.get('supportedCategories')?.markAsTouched()
    this.venueForm.get('supportedCategories')?.updateValueAndValidity();
  }
  /**
    * @description getter function to get screens as FormArray.
    * @author Inzamam
    * @returnType FormArray
    */
  get screens() {
    return this.venueForm.get('screens') as FormArray
  }
  /**
    * @description function to add screen.
    * @author Inzamam
    * @returnType void
    */
  addScreen() {
    this.screens.push(this.createScreen())
  }
  /**
    * @description function to remove screen 
    * @author Inzamam
    * @params index at which screen to remove
    * @returnType void
    */
  removeScreen(index: number) {

    const screens = this.screens;
    screens.removeAt(index);
    this.venueForm.setControl('screens', this.fb.array(screens.controls));


  }
  /**
    * @description getter function to get layouts as FormArray
    * @author Inzamam
    * @params screen of  which to get layouts 
    * @returnType FormArray
    */
  getLayouts(screen: AbstractControl): FormArray {
    return screen.get('layouts') as FormArray
  }
  /**
    * @description function to get used rows in screen .
    * @author Inzamam
    * @params screen  in which to get available rows 
    * @returnType array of strings [a,b,c]
    */
  getUsedRowsInScreen(screen: AbstractControl): string[] {
    const used: string[] = [];
    const layouts = this.getLayouts(screen).controls;
    layouts.forEach(layout => {
      const rows = layout.get('rows') as FormArray;
      (rows.value || []).forEach((val: any) => { if (val) used.push(val); });
    });
    return used;
  }

  /**
  * @description function to get availabel rows in screen and current category(layout like GOLD | SILVER)  .
  * @author Inzamam
  * @params screen and layout in which to get available rows 
  * @returnType array of strings [a,b,c]
  */
  getAvailableRows(screen: AbstractControl, currentLayout: AbstractControl): string[] {
    const used = this.getUsedRowsInScreen(screen).filter(Boolean); // remove falsy values
    const currentRows = (currentLayout.get('rows') as FormArray)?.value || [];
    return this.alphabets.filter(
      letter => !used.includes(letter) || currentRows.includes(letter)
    );
  }

  /**
    * @description utility function that generates unique id
    * @author Inzamam
    * @returnType string
    */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  /**
    * @description function that creates form group of Layout(category like GOLD | SILVER)  .
    * @author Inzamam
    * @returnType FormGroup
    */
  createLayout(): FormGroup {
    return this.fb.group({
      id: [this.generateId()],
      layoutName: ['', [Validators.required, this.nameValidator()]],
      rows: this.fb.array([], Validators.required),
      cols: [12, [Validators.required]]
    });
  }
  /**
    * @description function that creates form group of screen.
    * @author Inzamam
    * @returnType FormGroup
    */
  createScreen(): FormGroup {
    return this.fb.group({
      screenName: ['', [Validators.required, this.nameValidator()]],
      id: [this.generateId()],
      layouts: this.fb.array([this.createLayout()])
    })
  }



  /**
    * @description function to add  category(layout like GOLD | SILVER)  .
    * @author Inzamam
    * @params screen in which  to add 
    * @returnType void
    */
  addLayout(screen: AbstractControl) {
    this.getLayouts(screen).push(this.createLayout())
  }


  /**
  * @description function to remove category(layout like GOLD | SILVER)  .
  * @author Inzamam
  * @params screen from where to remove and index which one to remove
  * @returnType void
  */
  removeLayout(screen: AbstractControl, index: number) {
    const layoutsFA = this.getLayouts(screen);
    // remove the layout
    layoutsFA.removeAt(index);

    const newLayouts = this.fb.array(
      layoutsFA.controls.map(ctrl => {
        const raw = {
          id: ctrl.get('id')?.value || this.generateId(),
          layoutName: ctrl.get('layoutName')?.value || '',
          rows: ((ctrl.get('rows') as FormArray)?.value || []).slice(),
          cols: ctrl.get('cols')?.value || 12
        };

        return this.fb.group({
          id: [raw.id],
          layoutName: [raw.layoutName, [Validators.required, this.nameValidator()]],
          rows: this.fb.array((raw.rows as string[]).map(r => this.fb.control(r)), Validators.required),
          cols: [raw.cols, [Validators.required]]
        });
      })
    );

    (screen as FormGroup).setControl('layouts', newLayouts);
    this.venueForm.updateValueAndValidity();
    this.addScreen();
    this.removeScreen(this.screens.length - 1)
  }

  /**
  * @description Getter for amenities
  * @author Inzamam
  * @returnType void
  */
  get amenities(): FormArray {
    return this.venueForm.get('amenities') as FormArray;
  }

  /**
  * @description function to add  amenity on add btn click .
  * @author Inzamam
  * @returnType void
  */
  addAmenity(): void {
    if (this.tempAmmenity.value != '') {
      this.amenities.push(this.fb.control(this.tempAmmenity.value));
      this.tempAmmenity.setValue('')
    }
  }

  /**
  * @description function to remove amenity .
  * @author Inzamam
  * @params index number
  * @returnType void
  */
  removeAmenity(index: number): void {
    this.amenities.removeAt(index);
  }

  /**
 * @description utility func that takes obj and filters-out ids key
 * @author Inzamam
 * @param obj
 * @returnType obj
 */
  filterIds(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item: any) => this.filterIds(item));
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj)
        .filter(key => key !== 'id')
        .reduce((acc: any, key) => {
          acc[key] = this.filterIds(obj[key]);
          return acc;
        }, {});
    }
    return obj;
  }

  /**
  * @description function that validates and then  submit the form .
  * @author Inzamam
  * @returnType void
  */
  onSubmit(): void {
    if (this.venueForm.valid) {
      this.venuesService.createVenueService(this.venueForm.value).subscribe({
        next: () => {
          this.toaster.success('Venue created successfully')
          this.venueForm.removeControl('screens')
          this.venueForm.reset()
          this.venueForm.get('venueFor')?.setValue('');
          this.venueForm.get('venueType')?.setValue('');
          this.venueForm.get('address.cityName')?.setValue('');
          (this.venueForm.get('supportedCategories') as FormArray).clear();
          (this.venueForm.get('amenities') as FormArray).clear();
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

  /**
  * @description function used to handle row change
  * @author Inzamam
  * @params event and layout
  * @returnType void
  */
  onCheckboxChange(event: any, layout: AbstractControl): void {
    let rows = layout.get('rows') as FormArray
    if (event.target.checked) {
      rows.push(new FormControl(event.target.value))
    }
    else {
      const index = rows.controls.findIndex(x => x.value === event.target.value);
      rows.removeAt(index)
    }
    layout.get('rows')?.markAsTouched()
    layout.get('rows')?.updateValueAndValidity();
  }

}

