import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieLandingPageComponent } from './movies-landingpage.component';

describe('MovieLandingPageComponent', () => {
  let component: MovieLandingPageComponent;
  let fixture: ComponentFixture<MovieLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovieLandingPageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MovieLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
