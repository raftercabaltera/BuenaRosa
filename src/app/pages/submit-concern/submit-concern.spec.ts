import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitConcern } from './submit-concern';

describe('SubmitConcern', () => {
  let component: SubmitConcern;
  let fixture: ComponentFixture<SubmitConcern>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitConcern],
    }).compileComponents();

    fixture = TestBed.createComponent(SubmitConcern);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
