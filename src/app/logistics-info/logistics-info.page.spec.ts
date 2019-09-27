import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticsInfoPage } from './logistics-info.page';

describe('LogisticsInfoPage', () => {
  let component: LogisticsInfoPage;
  let fixture: ComponentFixture<LogisticsInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogisticsInfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogisticsInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
