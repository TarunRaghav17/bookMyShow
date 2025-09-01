import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-venue',
  imports: [ReactiveFormsModule],
  templateUrl: './create-venue-form.component.html',
  styleUrl: './create-venue-form.component.scss'
})
export class CreateVenueFormComponent {
  createVenueForm: FormGroup
  constructor(private fb: FormBuilder) {
    this.createVenueForm = this.fb.group({
      theatreName: ['', Validators.required],
      theatreCity: [''],
      screens: this.fb.array([this.createScreen()])

    })

  }
  onSubmit(form: FormGroup) {
    console.log(form.value)


  }


  createScreen(): FormGroup {
    return this.fb.group({
      screenName: ['', Validators.required],
      screenCapacity: ['', Validators.required],
      layout: this.fb.array([this.createCategory()])

    })

  }

  createCategory(): FormGroup {
    return this.fb.group({
      rowName: ['', Validators.required],
      cols: [''],
      categoryName: ['']

    })

  }


  addScreen() {
    this.screens.push(this.createScreen())
  }



  addCategory(screen: AbstractControl) {
       const layouts = this.getLayouts(screen);
    layouts.push(this.createCategory())
  }


  get screens() {
    return this.createVenueForm.get('screens') as FormArray
  }

  // get layout() {
  //   return this.createVenueForm.get('layout') as FormArray
  // }


getLayouts(screen: AbstractControl): FormArray {
  return screen.get('layout') as FormArray;
}




}
