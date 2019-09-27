import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterfallPage } from './waterfall.page';

describe('WaterfallPage', () => {
  let component: WaterfallPage;
  let fixture: ComponentFixture<WaterfallPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaterfallPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterfallPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
