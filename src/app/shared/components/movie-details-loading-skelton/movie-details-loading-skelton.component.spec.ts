import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieDetailsLoadingSkeltonComponent } from './movie-details-loading-skelton.component';

describe('MovieDetailsLoadingSkeltonComponent', () => {
  let component: MovieDetailsLoadingSkeltonComponent;
  let fixture: ComponentFixture<MovieDetailsLoadingSkeltonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovieDetailsLoadingSkeltonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieDetailsLoadingSkeltonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
