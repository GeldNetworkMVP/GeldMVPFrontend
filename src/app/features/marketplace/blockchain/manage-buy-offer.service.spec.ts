import { TestBed } from '@angular/core/testing';

import { ManageBuyOfferService } from './manage-buy-offer.service';

describe('ManageBuyOfferService', () => {
  let service: ManageBuyOfferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageBuyOfferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
