import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstTimePasswordChangeComponent } from './first-time-password-change.component';

describe('FirstTimePasswordChangeComponent', () => {
  let component: FirstTimePasswordChangeComponent;
  let fixture: ComponentFixture<FirstTimePasswordChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstTimePasswordChangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstTimePasswordChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
