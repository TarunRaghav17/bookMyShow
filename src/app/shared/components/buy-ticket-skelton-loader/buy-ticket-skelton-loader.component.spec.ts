import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyTicketSkeltonLoaderComponent } from './buy-ticket-skelton-loader.component';

describe('BuyTicketSkeltonLoaderComponent', () => {
  let component: BuyTicketSkeltonLoaderComponent;
  let fixture: ComponentFixture<BuyTicketSkeltonLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyTicketSkeltonLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyTicketSkeltonLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
