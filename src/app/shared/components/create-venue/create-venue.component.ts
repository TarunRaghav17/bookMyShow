import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-venue-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-venue.component.html'
})
export class CreateVenueComponent implements OnInit {
  venueForm!: FormGroup;

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
      supportedCategories: this.fb.array([this.fb.control('', Validators.required)]),
      additionalFields: this.fb.group({}),
      amenities: this.fb.array([this.fb.control('', Validators.required)])
    });
  }

  onVenueForChange() {
    let additionalFields = this.venueForm.get('additionalFields') as FormGroup

    additionalFields.addControl('screens',
      this.fb.array([

        this.fb.group({
          screenName: ['screen-1'],
          layout: ['layout-1']
        }), this.fb.group({
          screenName: ['screen-2'],
          layout: ['layout-2']
        })

      ]))
    let screens = this.venueForm.get('additionalFields.screens') as FormArray


    let screensArray = screens.controls

    console.log(this.venueForm.value)
    console.log(screensArray[1].value)

  }


  get screens() {
    return this.venueForm.get('additionalFields.screens') as FormArray
  }

  additionalFields = [
    {
      screens: [{ screenName: "screen-1" }]
    }
  ]
  // Getter for supportedCategories
  get supportedCategories(): FormArray {
    return this.venueForm.get('supportedCategories') as FormArray;
  }

  // Getter for amenities
  get amenities(): FormArray {
    return this.venueForm.get('amenities') as FormArray;
  }

  // Add/Remove supportedCategories
  addCategory(): void {
    this.supportedCategories.push(this.fb.control('', Validators.required));
  }

  removeCategory(index: number): void {
    this.supportedCategories.removeAt(index);
  }

  // Add/Remove amenities
  addAmenity(): void {
    this.amenities.push(this.fb.control('', Validators.required));
  }

  removeAmenity(index: number): void {
    this.amenities.removeAt(index);
  }

  // Submit
  onSubmit(): void {
    // if (this.venueForm.valid) {
    console.log('Form Submitted:', this.venueForm.value);
    // } else {
    //   this.venueForm.markAllAsTouched();
    // }
  }



}

