import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpServePage } from './help-serve.page';

describe('HelpServePage', () => {
  let component: HelpServePage;
  let fixture: ComponentFixture<HelpServePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpServePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpServePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
