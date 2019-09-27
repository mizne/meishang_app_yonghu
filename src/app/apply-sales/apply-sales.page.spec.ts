import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplySalesPage } from './apply-sales.page';

describe('ApplySalesPage', () => {
  let component: ApplySalesPage;
  let fixture: ComponentFixture<ApplySalesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplySalesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplySalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
