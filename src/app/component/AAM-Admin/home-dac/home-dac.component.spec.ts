import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeDACComponent } from './home-dac.component';

describe('HomeDACComponent', () => {
  let component: HomeDACComponent;
  let fixture: ComponentFixture<HomeDACComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeDACComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeDACComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
