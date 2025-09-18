import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-content',
  templateUrl: './create-content.component.html',
  standalone:false
})
export class CreateContentComponent implements OnInit {
  eventForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      // Top-level general info
      name: ['', Validators.required],
      description: [''],
      runTime: [''],
      startDate: [''],
      endDate: [''],
      eventType: ['', Validators.required],
      imageurl: [''],
      imdbRating: [null],
      likes: [null],
      votes: [null],
      currentlyPlaying: [false],
      deleted: [false],
      ageLimit: [null],
      releasingOn: [''],

      // Array fields
      languages: this.fb.array([]),
      genres: this.fb.array([]),
      format: this.fb.array([]),
      tag: this.fb.array([]),
      releaseMonth: this.fb.array([]),
      dateFilter: this.fb.array([]),
      categories: this.fb.array([]),
      moreFilters: this.fb.array([]),
      price: this.fb.array([]),
      city: this.fb.array([]),

      // Nested object arrays
      cast: this.fb.array([]),
      crew: this.fb.array([]),
    });
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

  addCast(actorName = '', castImg = '') {
    this.castControls.push(
      this.fb.group({
        actorName: [actorName, Validators.required],
        castImg: [castImg],
      })
    );
  }

  addCrew(memberName = '', crewImg = '') {
    this.crewControls.push(
      this.fb.group({
        memberName: [memberName, Validators.required],
        crewImg: [crewImg],
      })
    );
  }

  onSubmit() {
    console.log(this.eventForm.value);
  }
}
