import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingEventsComponent } from './booking-events.component';

describe('BookingEventsComponent', () => {
  let component: BookingEventsComponent;
  let fixture: ComponentFixture<BookingEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookingEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
