import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityWiseIssueComponent } from './facility-wise-issue.component';

describe('FacilityWiseIssueComponent', () => {
  let component: FacilityWiseIssueComponent;
  let fixture: ComponentFixture<FacilityWiseIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacilityWiseIssueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacilityWiseIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
