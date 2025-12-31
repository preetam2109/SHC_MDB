import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacwiseAAMPerformanceComponent } from './facwise-aamperformance.component';

describe('FacwiseAAMPerformanceComponent', () => {
  let component: FacwiseAAMPerformanceComponent;
  let fixture: ComponentFixture<FacwiseAAMPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacwiseAAMPerformanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacwiseAAMPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
