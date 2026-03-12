import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileVet } from './profile-vet';

describe('ProfileVet', () => {
  let component: ProfileVet;
  let fixture: ComponentFixture<ProfileVet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileVet],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileVet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
