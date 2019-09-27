import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterTestPage } from './water-test.page';

describe('WaterTestPage', () => {
  let component: WaterTestPage;
  let fixture: ComponentFixture<WaterTestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaterTestPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
