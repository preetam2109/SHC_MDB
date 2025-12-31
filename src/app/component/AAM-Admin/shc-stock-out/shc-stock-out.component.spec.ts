import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShcStockOutComponent } from './shc-stock-out.component';

describe('ShcStockOutComponent', () => {
  let component: ShcStockOutComponent;
  let fixture: ComponentFixture<ShcStockOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShcStockOutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShcStockOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
