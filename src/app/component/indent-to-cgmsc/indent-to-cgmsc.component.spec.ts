import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentToCgmscComponent } from './indent-to-cgmsc.component';

describe('IndentToCgmscComponent', () => {
  let component: IndentToCgmscComponent;
  let fixture: ComponentFixture<IndentToCgmscComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndentToCgmscComponent]
    });
    fixture = TestBed.createComponent(IndentToCgmscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
