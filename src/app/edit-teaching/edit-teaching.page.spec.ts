import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTeachingPage } from './edit-teaching.page';

describe('EditTeachingPage', () => {
  let component: EditTeachingPage;
  let fixture: ComponentFixture<EditTeachingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTeachingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTeachingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
