import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptDateEntryComponent } from './receipt-date-entry.component';

describe('ReceiptDateEntryComponent', () => {
  let component: ReceiptDateEntryComponent;
  let fixture: ComponentFixture<ReceiptDateEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceiptDateEntryComponent]
    });
    fixture = TestBed.createComponent(ReceiptDateEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
