import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialsManualsComponent } from './tutorials-manuals.component';

describe('TutorialsManualsComponent', () => {
  let component: TutorialsManualsComponent;
  let fixture: ComponentFixture<TutorialsManualsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorialsManualsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorialsManualsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
