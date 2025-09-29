import { TestBed } from '@angular/core/testing';

import { ListContentsService } from './list-contents.service';

describe('ListContentsService', () => {
  let service: ListContentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListContentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
