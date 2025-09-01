import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsLandingPageComponent } from './events-landingpage.component';

describe('LandingpageComponent', () => {
  let component: EventsLandingPageComponent;
  let fixture: ComponentFixture<EventsLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventsLandingPageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EventsLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
