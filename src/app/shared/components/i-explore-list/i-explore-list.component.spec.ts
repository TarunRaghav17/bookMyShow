import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IExploreListComponent } from './i-explore-list.component';

describe('IExploreListComponent', () => {
  let component: IExploreListComponent;
  let fixture: ComponentFixture<IExploreListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IExploreListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IExploreListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
