import { TestBed } from '@angular/core/testing';

import { SportsService } from './service/sports.service';

describe('SportsService', () => {
  let service: SportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
