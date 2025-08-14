import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearcboxComponent } from './searcbox.component';

describe('SearcboxComponent', () => {
  let component: SearcboxComponent;
  let fixture: ComponentFixture<SearcboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearcboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearcboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
