import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListYourShowLandingPageComponent } from './list-your-show-landing-page.component';

describe('ListYourShowLandingPageComponent', () => {
  let component: ListYourShowLandingPageComponent;
  let fixture: ComponentFixture<ListYourShowLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListYourShowLandingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListYourShowLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
