import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ContentService } from './content-services/content.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-create-content',
  templateUrl: './create-content.component.html',
  standalone: false
})
export class CreateContentComponent implements OnInit {

  eventForm!: FormGroup;

  selectedEventType: string | null = null;
  languagesArray: any
  genresArray: any;
  formatsArray: any;
  tagsArray: any;
  categoriesArray: any;
  moreFilters: any;

  constructor(private fb: FormBuilder,
    private contentService: ContentService,
    private toaster: ToastrService
  ) { }

  ngOnInit(): void {

    this.setMinDate();
    this.eventForm = this.fb.group({
      eventType: ['', Validators.required],
      imageurl: ['', Validators.required],
      name: ['', Validators.required, Validators.minLength(4)],
      description: ['', [Validators.required, Validators.minLength(30)]],
      runTime: ['', [Validators.required, Validators.min(1)]],
      releasingOn: ['', Validators.required],

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
  onSubmit() {
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
