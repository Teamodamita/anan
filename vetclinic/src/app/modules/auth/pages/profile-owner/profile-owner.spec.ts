import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileOwner } from './profile-owner';

describe('ProfileOwner', () => {
  let component: ProfileOwner;
  let fixture: ComponentFixture<ProfileOwner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileOwner],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileOwner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
