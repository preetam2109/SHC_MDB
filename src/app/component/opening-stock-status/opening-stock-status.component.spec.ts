import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningStockStatusComponent } from './opening-stock-status.component';

describe('OpeningStockStatusComponent', () => {
  let component: OpeningStockStatusComponent;
  let fixture: ComponentFixture<OpeningStockStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpeningStockStatusComponent]
    });
    fixture = TestBed.createComponent(OpeningStockStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
