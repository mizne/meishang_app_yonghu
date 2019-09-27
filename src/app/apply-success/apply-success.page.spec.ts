import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplySuccessPage } from './apply-success.page';

describe('ApplySuccessPage', () => {
  let component: ApplySuccessPage;
  let fixture: ComponentFixture<ApplySuccessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplySuccessPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplySuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
