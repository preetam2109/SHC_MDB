import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistfacilityInformationComponent } from './distfacility-information.component';

describe('DistfacilityInformationComponent', () => {
  let component: DistfacilityInformationComponent;
  let fixture: ComponentFixture<DistfacilityInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistfacilityInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistfacilityInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
