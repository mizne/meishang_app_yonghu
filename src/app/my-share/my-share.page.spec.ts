import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MySharePage } from './my-share.page';

describe('MySharePage', () => {
  let component: MySharePage;
  let fixture: ComponentFixture<MySharePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MySharePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySharePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
