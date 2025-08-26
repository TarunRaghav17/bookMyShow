import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterAccordionComponent } from './filter-accordion.component';

describe('FilterAccordianComponent', () => {
  let component: FilterAccordionComponent;
  let fixture: ComponentFixture<FilterAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterAccordionComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FilterAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
