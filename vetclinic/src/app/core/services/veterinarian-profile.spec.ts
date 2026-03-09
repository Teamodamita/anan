import { TestBed } from '@angular/core/testing';

import { VeterinarianProfile } from './veterinarian-profile';

describe('VeterinarianProfile', () => {
  let service: VeterinarianProfile;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VeterinarianProfile);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
