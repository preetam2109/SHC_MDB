import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningStockReportComponent } from './opening-stock-report.component';

describe('OpeningStockReportComponent', () => {
  let component: OpeningStockReportComponent;
  let fixture: ComponentFixture<OpeningStockReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpeningStockReportComponent]
    });
    fixture = TestBed.createComponent(OpeningStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
