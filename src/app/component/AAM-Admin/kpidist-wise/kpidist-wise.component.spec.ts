import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KPIdistWiseComponent } from './kpidist-wise.component';

describe('KPIdistWiseComponent', () => {
  let component: KPIdistWiseComponent;
  let fixture: ComponentFixture<KPIdistWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KPIdistWiseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KPIdistWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
