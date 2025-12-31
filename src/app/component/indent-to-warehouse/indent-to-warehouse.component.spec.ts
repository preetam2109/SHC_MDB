import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentToWarehouseComponent } from './indent-to-warehouse.component';

describe('IndentToWarehouseComponent', () => {
  let component: IndentToWarehouseComponent;
  let fixture: ComponentFixture<IndentToWarehouseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndentToWarehouseComponent]
    });
    fixture = TestBed.createComponent(IndentToWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
