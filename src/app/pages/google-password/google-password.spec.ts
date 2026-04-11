import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GooglePassword } from './google-password';

describe('GooglePassword', () => {
  let component: GooglePassword;
  let fixture: ComponentFixture<GooglePassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GooglePassword],
    }).compileComponents();

    fixture = TestBed.createComponent(GooglePassword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
