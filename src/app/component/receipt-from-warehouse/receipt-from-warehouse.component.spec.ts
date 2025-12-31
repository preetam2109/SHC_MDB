import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptFromWarehouseComponent } from './receipt-from-warehouse.component';

describe('ReceiptFromWarehouseComponent', () => {
  let component: ReceiptFromWarehouseComponent;
  let fixture: ComponentFixture<ReceiptFromWarehouseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceiptFromWarehouseComponent]
    });
    fixture = TestBed.createComponent(ReceiptFromWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
