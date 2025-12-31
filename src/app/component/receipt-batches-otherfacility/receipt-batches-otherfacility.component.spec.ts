import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptBatchesOtherfacilityComponent } from './receipt-batches-otherfacility.component';

describe('ReceiptBatchesOtherfacilityComponent', () => {
  let component: ReceiptBatchesOtherfacilityComponent;
  let fixture: ComponentFixture<ReceiptBatchesOtherfacilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiptBatchesOtherfacilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptBatchesOtherfacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
