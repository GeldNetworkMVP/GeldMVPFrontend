import { TestBed } from '@angular/core/testing';

import { MarketservicesService } from './marketservices.service';

describe('MarketservicesService', () => {
  let service: MarketservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
