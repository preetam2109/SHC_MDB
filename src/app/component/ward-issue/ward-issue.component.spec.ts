import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WardIssueComponent } from './ward-issue.component';

describe('WardIssueComponent', () => {
  let component: WardIssueComponent;
  let fixture: ComponentFixture<WardIssueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WardIssueComponent]
    });
    fixture = TestBed.createComponent(WardIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
