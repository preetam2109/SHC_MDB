import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityItemWiseStockComponent } from './facility-item-wise-stock.component';

describe('FacilityItemWiseStockComponent', () => {
  let component: FacilityItemWiseStockComponent;
  let fixture: ComponentFixture<FacilityItemWiseStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacilityItemWiseStockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacilityItemWiseStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
