import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewIndentComponent } from './add-new-indent.component';

describe('AddNewIndentComponent', () => {
  let component: AddNewIndentComponent;
  let fixture: ComponentFixture<AddNewIndentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewIndentComponent]
    });
    fixture = TestBed.createComponent(AddNewIndentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
