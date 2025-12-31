import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseStockComponent } from './warehouse-stock.component';

describe('WarehouseStockComponent', () => {
  let component: WarehouseStockComponent;
  let fixture: ComponentFixture<WarehouseStockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WarehouseStockComponent]
    });
    fixture = TestBed.createComponent(WarehouseStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
