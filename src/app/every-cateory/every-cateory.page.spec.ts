import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EveryCateoryPage } from './every-cateory.page';

describe('EveryCateoryPage', () => {
  let component: EveryCateoryPage;
  let fixture: ComponentFixture<EveryCateoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EveryCateoryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EveryCateoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
