import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptBatchesComponent } from './receipt-batches.component';

describe('ReceiptBatchesComponent', () => {
  let component: ReceiptBatchesComponent;
  let fixture: ComponentFixture<ReceiptBatchesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceiptBatchesComponent]
    });
    fixture = TestBed.createComponent(ReceiptBatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
