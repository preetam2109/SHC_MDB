import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherfacilityIndentItemsComponent } from './otherfacility-indent-items.component';

describe('OtherfacilityIndentItemsComponent', () => {
  let component: OtherfacilityIndentItemsComponent;
  let fixture: ComponentFixture<OtherfacilityIndentItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherfacilityIndentItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherfacilityIndentItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
