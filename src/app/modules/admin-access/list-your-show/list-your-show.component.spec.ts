import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListYourShowComponent } from './list-your-show.component';

describe('ListYourShowComponent', () => {
  let component: ListYourShowComponent;
  let fixture: ComponentFixture<ListYourShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListYourShowComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListYourShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
