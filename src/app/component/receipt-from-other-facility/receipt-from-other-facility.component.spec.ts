import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptFromOtherFacilityComponent } from './receipt-from-other-facility.component';

describe('ReceiptFromOtherFacilityComponent', () => {
  let component: ReceiptFromOtherFacilityComponent;
  let fixture: ComponentFixture<ReceiptFromOtherFacilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiptFromOtherFacilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptFromOtherFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
