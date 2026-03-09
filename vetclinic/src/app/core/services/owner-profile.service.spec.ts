import { TestBed } from '@angular/core/testing';

import { OwnerProfile } from './owner-profile.service';

describe('OwnerProfile', () => {
  let service: OwnerProfile;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OwnerProfile);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
