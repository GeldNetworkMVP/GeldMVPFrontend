import { TestBed } from '@angular/core/testing';

import { FreighterComponentService } from './freighter-component.service';

describe('FreighterComponentService', () => {
  let service: FreighterComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FreighterComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
