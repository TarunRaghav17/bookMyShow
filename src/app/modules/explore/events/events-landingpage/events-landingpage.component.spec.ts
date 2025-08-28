import { ComponentFixture, TestBed } from '@angular/core/testing';

import { eventsLandingpageComponent } from './events-landingpage.component';

describe('LandingpageComponent', () => {
  let component: eventsLandingpageComponent;
  let fixture: ComponentFixture<eventsLandingpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [eventsLandingpageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(eventsLandingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
