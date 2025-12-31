import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseIndentComponent } from './warehouse-indent.component';

describe('WarehouseIndentComponent', () => {
  let component: WarehouseIndentComponent;
  let fixture: ComponentFixture<WarehouseIndentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WarehouseIndentComponent]
    });
    fixture = TestBed.createComponent(WarehouseIndentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
