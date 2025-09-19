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
    this.eventForm = this.fb.group({

      eventType: ['', Validators.required],
      imageurl: [''],
      name: ['', Validators.required],
      description: [''],
      runTime: [''],
      releasingOn: [''],
      startDate: [''],
      endDate: [''],
      imdbRating: [null],
      likes: [null],
      votes: [null],
      currentlyPlaying: [false],
      deleted: [false],
      ageLimit: [null],

      languages: this.fb.array([],Validators.required),
      genres: this.fb.array([]),
      format: this.fb.array([]),
      tag: this.fb.array([]),
      categories: this.fb.array([]),
      moreFilters: this.fb.array([]),
      releaseMonth: this.fb.array([]),
      dateFilter: this.fb.array([]),
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

  onContentTypeChange() {



    this.selectedEventType = this.eventForm.get('eventType')?.value


    forkJoin({

      languages:
        this.contentService.getLanguagesByContentType(this.selectedEventType),

      genres: this.contentService.getGenresByContentType(this.selectedEventType),

      formats: this.contentService.getFormatsByContentType(this.selectedEventType),

      tags: this.contentService.getTagsByContentType(this.selectedEventType),

      categories:
        this.contentService.getCategoriesByContentType(this.selectedEventType),
      moreFilters:
        this.contentService.getMoreFiltersByContentType(this.selectedEventType)
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


  handleInputBoxChange(event:any,path:string,index:number){
    console.log(event,path,index)
    if(event?.target.checked){
      console.log('add')
      this.addFormArrayItem(path,Number(event.target.value))

    }
    else{
      console.log('remove')
      this.removeFormArrayItem(path,index)
    }
    
  }
  onSubmit() {
    console.log(this.eventForm.value);
  }
}
