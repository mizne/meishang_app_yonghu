import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMyTeachingPage } from './edit-my-teaching.page';

describe('EditMyTeachingPage', () => {
  let component: EditMyTeachingPage;
  let fixture: ComponentFixture<EditMyTeachingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMyTeachingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMyTeachingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
