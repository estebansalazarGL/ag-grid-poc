import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellButtonComponent } from './cell-button.component';

describe('CellButtonComponent', () => {
  let component: CellButtonComponent;
  let fixture: ComponentFixture<CellButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
