import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OthersPagePage } from './others-page.page';

describe('OthersPagePage', () => {
  let component: OthersPagePage;
  let fixture: ComponentFixture<OthersPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OthersPagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OthersPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
