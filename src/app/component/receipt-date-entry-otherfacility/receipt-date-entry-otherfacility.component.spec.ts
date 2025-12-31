import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptDateEntryOtherfacilityComponent } from './receipt-date-entry-otherfacility.component';

describe('ReceiptDateEntryOtherfacilityComponent', () => {
  let component: ReceiptDateEntryOtherfacilityComponent;
  let fixture: ComponentFixture<ReceiptDateEntryOtherfacilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiptDateEntryOtherfacilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptDateEntryOtherfacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
