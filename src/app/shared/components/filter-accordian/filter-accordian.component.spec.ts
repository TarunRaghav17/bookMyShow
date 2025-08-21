import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterAccordianComponent } from './filter-accordian.component';

describe('FilterAccordianComponent', () => {
  let component: FilterAccordianComponent;
  let fixture: ComponentFixture<FilterAccordianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterAccordianComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterAccordianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
