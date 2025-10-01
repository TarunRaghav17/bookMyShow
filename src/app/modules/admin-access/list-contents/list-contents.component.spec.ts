import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListContentsComponent } from './list-contents.component';

describe('ListContentsComponent', () => {
  let component: ListContentsComponent;
  let fixture: ComponentFixture<ListContentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListContentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
