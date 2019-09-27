import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveFootPage } from './active-foot.page';

describe('ActiveFootPage', () => {
  let component: ActiveFootPage;
  let fixture: ComponentFixture<ActiveFootPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveFootPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveFootPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
