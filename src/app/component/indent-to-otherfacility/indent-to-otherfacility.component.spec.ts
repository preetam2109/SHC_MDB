import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentToOtherfacilityComponent } from './indent-to-otherfacility.component';

describe('IndentToOtherfacilityComponent', () => {
  let component: IndentToOtherfacilityComponent;
  let fixture: ComponentFixture<IndentToOtherfacilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndentToOtherfacilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndentToOtherfacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
