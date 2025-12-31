import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentStockReportComponent } from './parent-stock-report.component';

describe('ParentStockReportComponent', () => {
  let component: ParentStockReportComponent;
  let fixture: ComponentFixture<ParentStockReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParentStockReportComponent]
    });
    fixture = TestBed.createComponent(ParentStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
