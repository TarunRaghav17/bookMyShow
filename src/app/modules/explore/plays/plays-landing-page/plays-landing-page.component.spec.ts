import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaysLandingPageComponent } from './plays-landing-page.component';

describe('PlaysLandingPageComponent', () => {
  let component: PlaysLandingPageComponent;
  let fixture: ComponentFixture<PlaysLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlaysLandingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaysLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
